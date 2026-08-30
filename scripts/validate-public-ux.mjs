import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const failures = [];

if (!fs.existsSync(dist)) {
  console.error('Public UX validation failed: dist/ does not exist. Run the build first.');
  process.exit(1);
}

const forbiddenPublicPhrases = [
  'Legal Review Flag',
  'final production signoff',
  'final production approval',
  'Formatting and consistency issues were corrected in this phase',
  'Substantive legal language should be reviewed by counsel',
  'Substantive legal terms require attorney review'
];

const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
};
walk(dist);

const stripTags = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const attrValue = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2].trim() : null;
};

const localAssetExtensions = /\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)(?:[?#].*)?$/i;
const assetExists = (url) => {
  const clean = url.split(/[?#]/, 1)[0];
  const assetPath = path.join(dist, clean.replace(/^\//, ''));
  return fs.existsSync(assetPath) && fs.statSync(assetPath).isFile() && fs.statSync(assetPath).size > 0;
};

for (const filePath of htmlFiles) {
  const relative = path.relative(dist, filePath);
  const html = fs.readFileSync(filePath, 'utf8');

  for (const phrase of forbiddenPublicPhrases) {
    if (html.includes(phrase)) failures.push(`${relative}: internal-only public text detected: ${phrase}`);
  }

  const anchors = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>/gi)];
  for (const match of anchors) {
    const tag = match[0];
    const href = match[2].trim();
    if (!href || href === '#' || /^javascript:/i.test(href)) {
      failures.push(`${relative}: dead or placeholder anchor href detected: ${JSON.stringify(href)}`);
    }

    if (/\btarget\s*=\s*(["'])_blank\1/i.test(tag)) {
      const rel = attrValue(tag, 'rel') ?? '';
      if (!/\bnoopener\b/i.test(rel) || !/\bnoreferrer\b/i.test(rel)) {
        failures.push(`${relative}: target="_blank" link must include rel="noopener noreferrer": ${href}`);
      }
    }
  }

  const ids = [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]).filter(Boolean);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) failures.push(`${relative}: duplicate id detected: ${id}`);
    seen.add(id);
  }

  const mains = [...html.matchAll(/<main\b[^>]*>/gi)];
  if (mains.length !== 1) failures.push(`${relative}: expected exactly one <main> landmark, found ${mains.length}`);

  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
  if (h1s.length !== 1) failures.push(`${relative}: expected exactly one <h1>, found ${h1s.length}`);

  const skipAnchor = anchors.find((match) => /\bclass\s*=\s*(["'])[^"']*\bskip-link\b[^"']*\1/i.test(match[0]));
  const skipHref = skipAnchor ? attrValue(skipAnchor[0], 'href') : null;
  if (!skipHref || !skipHref.startsWith('#')) {
    failures.push(`${relative}: accessible skip link is missing or does not target a page id`);
  } else if (!ids.includes(skipHref.slice(1))) {
    failures.push(`${relative}: skip link target does not exist: ${skipHref}`);
  }

  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const image of images) {
    if (!/\balt\s*=\s*(["']).*?\1/i.test(image[0])) failures.push(`${relative}: image missing alt attribute`);
  }

  const buttons = [...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)];
  for (const button of buttons) {
    const tag = button[0].slice(0, button[0].indexOf('>') + 1);
    const ariaLabel = attrValue(tag, 'aria-label');
    const visibleText = stripTags(button[1]);
    if (!ariaLabel && !visibleText) failures.push(`${relative}: button has no accessible name`);
  }

  const controls = [...html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)];
  for (const control of controls) {
    const tag = control[0];
    const type = (attrValue(tag, 'type') ?? '').toLowerCase();
    if (type === 'hidden' || attrValue(tag, 'aria-hidden') === 'true') continue;

    const id = attrValue(tag, 'id');
    const ariaLabel = attrValue(tag, 'aria-label');
    const ariaLabelledby = attrValue(tag, 'aria-labelledby');
    if (!id && !ariaLabel && !ariaLabelledby) {
      failures.push(`${relative}: form control is missing an id or accessible label`);
      continue;
    }

    if (ariaLabel || ariaLabelledby) continue;
    const labelFor = id ? new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*(["'])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1[^>]*>`, 'i') : null;
    if (!labelFor || !labelFor.test(html)) {
      failures.push(`${relative}: form control #${id ?? '(no id)'} has no associated label`);
    }
  }

  const referencedAssets = [];
  for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*\b(?:src|href)\s*=\s*(["'])(.*?)\1[^>]*>/gi)) {
    const url = match[2].trim();
    if (url.startsWith('/') && localAssetExtensions.test(url)) referencedAssets.push(url);
  }

  for (const asset of referencedAssets) {
    if (!assetExists(asset)) failures.push(`${relative}: referenced local asset is missing or empty: ${asset}`);
  }
}

if (failures.length) {
  console.error('Public UX validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public UX validation passed for ${htmlFiles.length} generated HTML pages: public text, links, landmarks, H1 structure, skip links, buttons, form labels, image alt text, duplicate IDs, safe new-tab behavior, and local asset references are valid.`);
