import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const svgAssets = [
  'public/images/brand/sag-logo-v2.svg',
  'public/images/brand/sag-logo-dark.svg',
  'public/images/brand/sag-logo-white.svg',
  'public/images/brand/sag-icon.svg',
  'public/images/brand/institute-crest.svg'
];
const rasterAssets = ['public/images/brand/image.png'];
const failures = [];

for (const relativePath of svgAssets) {
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

for (const relativePath of rasterAssets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required raster brand asset: ${relativePath}`);
    continue;
  }
  const data = fs.readFileSync(filePath);
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (data.length < 1024) failures.push(`${relativePath}: suspiciously small production raster asset`);
  if (!data.subarray(0, 8).equals(pngSignature)) failures.push(`${relativePath}: not a valid PNG signature`);
}

const configPath = path.join(root, 'src', 'config', 'brand-assets.ts');
const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
for (const expected of ['/images/brand/image.png', '/images/brand/institute-crest.svg']) {
  if (!config.includes(expected)) failures.push(`brand asset registry does not reference ${expected}`);
}

const logoPath = path.join(root, 'src', 'components', 'brand', 'Logo.astro');
const logoComponent = fs.readFileSync(logoPath, 'utf8');
if (!logoComponent.includes('brandAttribution')) failures.push('Logo component does not use centralized Mandavere attribution');
if (!logoComponent.includes('brandAssets.sagSeal')) failures.push('Logo component does not use the centralized SAG seal asset');
if (!logoComponent.includes("className.split(/\\s+/).includes('footer-logo-link')")) failures.push('VetCert marks are not explicitly restricted to footer logo usage');
if (!logoComponent.includes('{isFooter && (')) failures.push('VetCert marks do not use the footer-only render guard');
for (const mark of ['SDVOSB', 'VOSB']) {
  if (!logoComponent.includes(`<strong>${mark}</strong>`)) failures.push(`footer is missing approved ${mark} trust mark`);
}

const sourceFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(astro|ts|js|mjs|css|html)$/i.test(entry.name)) sourceFiles.push(fullPath);
  }
};
walk(path.join(root, 'src'));
for (const filePath of sourceFiles) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (/HUBZone Certified/i.test(source)) failures.push(`${path.relative(root, filePath)}: unapproved HUBZone certification wording detected`);
  if (filePath !== logoPath && /vetcert-(?:footer|mark)/i.test(source)) failures.push(`${path.relative(root, filePath)}: VetCert badge markup found outside footer-controlled Logo component`);
}

const institutePage = fs.readFileSync(path.join(root, 'src', 'pages', 'institute.astro'), 'utf8');
if (!institutePage.includes('brandAssets.instituteCrest')) failures.push('Institute page does not use centralized Institute emblem path');

if (failures.length) {
  console.error('Brand asset validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Brand asset validation passed: ${svgAssets.length} required SVG assets, ${rasterAssets.length} production raster asset, footer-only VetCert controls, and attribution controls verified.`);
