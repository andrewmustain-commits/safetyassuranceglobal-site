import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const assets = [
  'public/images/brand/sag-logo-v2.svg',
  'public/images/brand/sag-logo-dark.svg',
  'public/images/brand/sag-logo-white.svg',
  'public/images/brand/sag-icon.svg',
  'public/images/brand/institute-crest.svg'
];
const failures = [];

for (const relativePath of assets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required brand asset: ${relativePath}`);
    continue;
  }
  const source = fs.readFileSync(filePath, 'utf8');
  if (!/<svg\b/i.test(source)) failures.push(`${relativePath}: not an SVG document`);
  if (!/viewBox\s*=\s*["'][^"']+["']/i.test(source)) failures.push(`${relativePath}: missing viewBox for responsive vector rendering`);
  if (/<image\b[^>]+(?:https?:)?\/\//i.test(source)) failures.push(`${relativePath}: contains an external raster/image dependency`);
}

const configPath = path.join(root, 'src', 'config', 'brand-assets.ts');
const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
for (const expected of ['/images/brand/sag-logo-v2.svg', '/images/brand/institute-crest.svg']) {
  if (!config.includes(expected)) failures.push(`brand asset registry does not reference ${expected}`);
}

const logoComponent = fs.readFileSync(path.join(root, 'src', 'components', 'brand', 'Logo.astro'), 'utf8');
if (!logoComponent.includes('brandAttribution')) failures.push('Logo component does not use centralized Mandavere attribution');

const institutePage = fs.readFileSync(path.join(root, 'src', 'pages', 'institute.astro'), 'utf8');
if (!institutePage.includes('brandAssets.instituteCrest')) failures.push('Institute page does not use centralized Institute emblem path');

if (failures.length) {
  console.error('Brand asset validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Brand asset validation passed: ${assets.length} required SVG assets and attribution controls verified.`);
