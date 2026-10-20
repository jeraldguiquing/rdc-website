/**
 * Injects the shared site header (partials/header.html) into every page.
 *
 * Usage (from the project root):   node tools/build-layout.js
 *
 * The header lives between these markers in each page:
 *   <!-- BEGIN:SITE-HEADER --> ... <!-- END:SITE-HEADER -->
 * Edit partials/header.html once, run this script, and all pages update.
 * The correct nav item is marked `active` per page automatically.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BEGIN = '<!-- BEGIN:SITE-HEADER -->';
const END = '<!-- END:SITE-HEADER -->';

// page file -> href of the top-level nav link that should be highlighted
const ACTIVE = {
  'index.html': 'index.html',
  'about-mcnp.html': 'about-mcnp.html',
  'about-isap.html': 'about-mcnp.html',
  'about-rdc.html': 'about-rdc.html',
  'about-rdc-mcnp.html': 'about-rdc.html',
  'about-rdc-isap.html': 'about-rdc.html',
  'rdc-agenda.html': 'rdc-agenda.html',
  'journal.html': 'journal.html',
  'journal-mcnp.html': 'journal.html',
  'journal-isap.html': 'journal.html',
  'journal-admin.html': 'journal.html',
  'utilization.html': 'utilization.html',
  'experience.html': 'experience.html',
  'resources.html': 'resources-mcnp.html',
  'resources-mcnp.html': 'resources-mcnp.html',
  'resources-isap.html': 'resources-mcnp.html',
  'news-events.html': 'news-events.html',
  'calendar.html': 'news-events.html',
  'call-for-proposals.html': 'news-events.html',
  'adg-advocacy.html': 'adg-advocacy.html',
  'sdg-overview.html': 'adg-advocacy.html',
  'contact.html': 'contact.html'
};

const template = fs.readFileSync(path.join(ROOT, 'partials', 'header.html'), 'utf8')
  .replace(/\r\n/g, '\n').replace(/\n+$/, '');

function renderFor(file) {
  const href = ACTIVE[file];
  if (!href) return template;
  const needle = `<a href="${href}" class="nav-link">`;
  return template.replace(needle, `<a href="${href}" class="nav-link active">`);
}

let changed = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = path.join(ROOT, file);
  const raw = fs.readFileSync(p, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let src = raw.replace(/\r\n/g, '\n');

  let start, end;
  const b = src.indexOf(BEGIN);
  if (b !== -1) {
    start = b;
    end = src.indexOf(END) + END.length;
  } else {
    // First run: locate the existing topbar + main header block.
    let t = src.search(/<header class="topbar"|<div class="topbar"/);
    const mh = src.indexOf('<header class="main-header"');
    if (t === -1 || mh === -1) { console.log('skip (no header):', file); continue; }
    const c = src.lastIndexOf('<!-- Top Institutional Bar -->', t);
    if (c !== -1 && t - c < 60) t = c;
    start = t;
    end = src.indexOf('</header>', mh) + '</header>'.length;
  }

  const block = `${BEGIN}\n  ${renderFor(file).replace(/^\s+/, '')}\n  ${END}`;
  const out = (src.slice(0, start) + block + src.slice(end)).replace(/\n/g, eol);
  if (out !== raw) { fs.writeFileSync(p, out, 'utf8'); changed++; console.log('updated:', file); }
}
console.log(`Done. ${changed} file(s) updated.`);

