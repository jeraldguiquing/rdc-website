/**
 * Image Optimization, WebP Generation & HTML <img> Attribute Enhancer
 * Usage: node tools/optimize-images.js  (or: npm run images)
 *
 * 1. Compresses oversized PNG/JPG/JPEG images in assets/ and upload/ in-place
 *    AND generates a .webp sibling for every PNG/JPG/JPEG image.
 *    (Originals are kept so OpenGraph, Twitter Card, JSON-LD, and favicon links work.)
 * 2. Updates <img src="..."> in HTML files to use the .webp version when available,
 *    sets explicit width and height attributes on every <img> tag, ensures
 *    loading="lazy" and decoding="async" are consistently applied, and upgrades
 *    any generic/empty alt attributes.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMG_DIRS = ['assets', 'upload'];
const MIN_COMPRESS_BYTES = 200 * 1024;
const MAX_DIMENSION = 1920;

function walkImages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(full, out);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function processImagesAndGenerateWebp() {
  const allFiles = [];
  for (const d of IMG_DIRS) walkImages(path.join(ROOT, d), allFiles);

  let savedOrigBytes = 0;
  let compressedCount = 0;
  let webpCreated = 0;
  let webpSavedBytes = 0;

  for (const file of allFiles) {
    const stat = fs.statSync(file);
    const ext = path.extname(file).toLowerCase();
    const webpPath = file.replace(/\.(png|jpe?g)$/i, '.webp');

    try {
      const inputBuf = fs.readFileSync(file);
      const img = sharp(inputBuf, { failOn: 'none' });
      const meta = await img.metadata();

      // 1. Compress oversized original in-place
      if (stat.size >= MIN_COMPRESS_BYTES) {
        let pipeline = sharp(inputBuf, { failOn: 'none' }).rotate();
        if ((meta.width && meta.width > MAX_DIMENSION) || (meta.height && meta.height > MAX_DIMENSION)) {
          pipeline = pipeline.resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          });
        }
        let outBuf;
        if (ext === '.png') {
          outBuf = await pipeline.png({ quality: 82, compressionLevel: 9, palette: true, effort: 8 }).toBuffer();
        } else {
          outBuf = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        }
        if (outBuf && outBuf.length < stat.size * 0.9) {
          fs.writeFileSync(file, outBuf);
          savedOrigBytes += (stat.size - outBuf.length);
          compressedCount++;
        }
      }

      // 2. Generate .webp version if missing
      if (!fs.existsSync(webpPath)) {
        let wPipe = sharp(inputBuf, { failOn: 'none' }).rotate();
        if ((meta.width && meta.width > MAX_DIMENSION) || (meta.height && meta.height > MAX_DIMENSION)) {
          wPipe = wPipe.resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          });
        }
        const webpBuf = await wPipe.webp({ quality: 82, effort: 4 }).toBuffer();
        fs.writeFileSync(webpPath, webpBuf);
        webpCreated++;
        if (webpBuf.length < stat.size) {
          webpSavedBytes += (stat.size - webpBuf.length);
        }
      }
    } catch (err) {
      // Skip unreadable image gracefully
    }
  }

  console.log(
    `Originals compressed: ${compressedCount} (${(savedOrigBytes / (1024 * 1024)).toFixed(2)} MB saved). ` +
    `WebP files created: ${webpCreated} (${(webpSavedBytes / (1024 * 1024)).toFixed(2)} MB smaller than originals).`
  );
}

function humanizeFilename(src) {
  const base = path.basename(decodeURIComponent(src.split('?')[0]), path.extname(src))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return base ? `${base} illustration` : 'MCNP and ISAP Research and Development Center image';
}

async function enhanceHtmlImgTags() {
  const dimCache = new Map();

  async function getDims(relSrc) {
    const clean = decodeURIComponent(relSrc.split('?')[0].split('#')[0]).replace(/^\//, '');
    const full = path.join(ROOT, clean);
    if (dimCache.has(full)) return dimCache.get(full);
    if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      dimCache.set(full, null);
      return null;
    }
    try {
      const meta = await sharp(fs.readFileSync(full), { failOn: 'none' }).metadata();
      const res = (meta.width && meta.height) ? { width: meta.width, height: meta.height } : null;
      dimCache.set(full, res);
      return res;
    } catch {
      dimCache.set(full, null);
      return null;
    }
  }

  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let updatedPages = 0;
  let updatedTags = 0;

  for (const file of htmlFiles) {
    const p = path.join(ROOT, file);
    const html = fs.readFileSync(p, 'utf8');
    const imgRegex = /<img\b([^>]*?)>/gi;
    let match;
    let out = '';
    let lastIdx = 0;
    let pageChanged = false;

    while ((match = imgRegex.exec(html)) !== null) {
      out += html.slice(lastIdx, match.index);
      lastIdx = imgRegex.lastIndex;

      const fullTag = match[0];
      let attrs = match[1].replace(/\s*\/\s*$/, '');
      const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch || /^https?:\/\/|^data:|\$\{/.test(srcMatch[1])) {
        out += fullTag;
        continue;
      }

      let currentSrc = srcMatch[1];
      let changed = false;

      // 1. Switch to .webp if a corresponding .webp exists on disk
      if (/\.(png|jpe?g)$/i.test(currentSrc)) {
        const webpCandidate = currentSrc.replace(/\.(png|jpe?g)$/i, '.webp');
        const cleanWebp = decodeURIComponent(webpCandidate.split('?')[0].split('#')[0]).replace(/^\//, '');
        if (fs.existsSync(path.join(ROOT, cleanWebp))) {
          attrs = attrs.replace(srcMatch[0], `src="${webpCandidate}"`);
          currentSrc = webpCandidate;
          changed = true;
        }
      }

      // 2. Consistent loading="lazy" and decoding="async"
      if (!/\bloading\s*=/i.test(attrs)) {
        attrs += ' loading="lazy"';
        changed = true;
      }
      if (!/\bdecoding\s*=/i.test(attrs)) {
        attrs += ' decoding="async"';
        changed = true;
      }

      // 3. Explicit width and height attributes
      if (!/\bwidth\s*=/i.test(attrs) || !/\bheight\s*=/i.test(attrs)) {
        // Check if fixed pixel dimensions are specified in inline style
        const styleMatch = attrs.match(/\bstyle\s*=\s*["']([^"']*)["']/i);
        const styleStr = styleMatch ? styleMatch[1] : '';
        const pxW = styleStr.match(/(?:^|;|\s)width\s*:\s*(\d+)px/i);
        const pxH = styleStr.match(/(?:^|;|\s)height\s*:\s*(\d+)px/i);

        let w = null, h = null;
        if (pxW && pxH) {
          w = Number(pxW[1]);
          h = Number(pxH[1]);
        } else {
          const dims = await getDims(currentSrc);
          if (dims) {
            w = dims.width;
            h = dims.height;
            // If inline style sets only height (or only width) in px, ensure the other axis is auto so width/height attrs don't stretch it
            if (styleMatch) {
              const hasW = /(?:^|;|\s)width\s*:/i.test(styleStr);
              const hasH = /(?:^|;|\s)height\s*:/i.test(styleStr);
              if (hasH && !hasW) {
                const updatedStyle = styleStr.replace(/;?\s*$/, '; width: auto;');
                attrs = attrs.replace(styleMatch[0], `style="${updatedStyle}"`);
              } else if (hasW && !hasH) {
                const updatedStyle = styleStr.replace(/;?\s*$/, '; height: auto;');
                attrs = attrs.replace(styleMatch[0], `style="${updatedStyle}"`);
              }
            }
          }
        }

        if (w && h) {
          if (!/\bwidth\s*=/i.test(attrs)) { attrs += ` width="${w}"`; changed = true; }
          if (!/\bheight\s*=/i.test(attrs)) { attrs += ` height="${h}"`; changed = true; }
        }
      }

      // 4. Useful alt text
      const altMatch = attrs.match(/\balt\s*=\s*["']([^"']*)["']/i);
      if (!altMatch) {
        attrs += ` alt="${humanizeFilename(currentSrc)}"`;
        changed = true;
      } else if (!altMatch[1].trim() || /^(image|photo|picture|logo|icon|img|banner)$/i.test(altMatch[1].trim())) {
        attrs = attrs.replace(altMatch[0], `alt="${humanizeFilename(currentSrc)}"`);
        changed = true;
      }

      if (changed) {
        pageChanged = true;
        updatedTags++;
        out += `<img${attrs}>`;
      } else {
        out += fullTag;
      }
    }
    out += html.slice(lastIdx);

    if (pageChanged && out !== html) {
      fs.writeFileSync(p, out, 'utf8');
      updatedPages++;
    }
  }

  console.log(`Enhanced ${updatedTags} <img> tag(s) across ${updatedPages} HTML page(s).`);
}

(async () => {
  await processImagesAndGenerateWebp();
  await enhanceHtmlImgTags();
})();
