/**
 * Site build:  node tools/build.js   (or: npm run build)
 *
 *  1. Injects the shared header into every page (tools/build-layout.js).
 *  2. Minifies CSS/JS sources into *.min.css / *.min.js next to them:
 *       css/style.css, css/news-events.css, css/pages/*.css
 *       js/main.js,    js/pages/*.js
 *  3. Stamps every *.min.css/js reference in the HTML with ?v=<content hash>
 *     so browsers always fetch fresh files after a change.
 *
 * Edit the NON-minified sources; never edit *.min.* by hand.
 * Images are handled separately:  npm run images
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const list = (dir, ext) => {
  const d = path.join(ROOT, dir);
  return fs.existsSync(d)
    ? fs.readdirSync(d).filter(f => f.endsWith(ext) && !f.endsWith('.min' + ext)).map(f => path.join(d, f))
    : [];
};

// 1. Layout
execFileSync(process.execPath, [path.join(__dirname, 'build-layout.js')], { stdio: 'inherit' });

// 2. Minify
const jobs = [
  ...['css/style.css', 'css/news-events.css'].map(f => ({ file: path.join(ROOT, f), loader: 'css', mangle: false })),
  ...list('css/pages', '.css').map(file => ({ file, loader: 'css', mangle: false })),
  { file: path.join(ROOT, 'js/main.js'), loader: 'js', mangle: true },
  // Page scripts keep top-level names intact (they are called from inline onclick="" handlers).
  ...list('js/pages', '.js').map(file => ({ file, loader: 'js', mangle: false })),
];

let before = 0, after = 0;
for (const { file, loader, mangle } of jobs) {
  const code = fs.readFileSync(file, 'utf8');
  const out = esbuild.transformSync(code, {
    loader,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: mangle,
    legalComments: 'none',
    target: 'es2019',
  }).code;
  const dest = file.replace(/\.(css|js)$/, '.min.$1');
  if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== out) fs.writeFileSync(dest, out, 'utf8');
  before += code.length; after += out.length;
  console.log(`min  ${rel(file).padEnd(34)} ${(code.length / 1024).toFixed(0).padStart(4)}KB -> ${(out.length / 1024).toFixed(0).padStart(4)}KB`);
}
console.log(`Minified total: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);

// 3. Cache-busting stamps
const hashOf = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
let stamped = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = path.join(ROOT, file);
  const html = fs.readFileSync(p, 'utf8');
  const out = html.replace(/((?:css|js)\/(?:pages\/)?[\w.-]+\.min\.(?:css|js))(\?v=[\w.-]+)?(?=["'])/g, (m, ref) => {
    const f = path.join(ROOT, ref);
    return fs.existsSync(f) ? `${ref}?v=${hashOf(f)}` : m;
  });
  if (out !== html) { fs.writeFileSync(p, out, 'utf8'); stamped++; }
}
console.log(`Version-stamped asset links in ${stamped} page(s).`);

