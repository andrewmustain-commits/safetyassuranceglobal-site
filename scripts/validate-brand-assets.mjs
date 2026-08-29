import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const svgAssets = [
  'public/images/brand/sag-logo-v2.svg',
  'public/images/brand/sag-logo-dark.svg',
  'public/images/brand/sag-logo-white.svg',
  'public/images/brand/sag-icon.svg',
  'public/images/brand/sag-official-seal-2026.svg',
  'public/images/brand/maritime-hero-v20.svg',
  'public/images/brand/institute-crest.svg'
];
const pngAssets = ['public/images/brand/sag-official-seal-2026.png'];
const jpegAssets = ['public/images/brand/sag-maritime-hero-2026.jpeg'];
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

for (const relativePath of pngAssets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required PNG brand asset: ${relativePath}`);
    continue;
  }
  const data = fs.readFileSync(filePath);
  const signature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if (data.length < 1024) failures.push(`${relativePath}: suspiciously small production raster asset`);
  if (!data.subarray(0, 8).equals(signature)) failures.push(`${relativePath}: not a valid PNG signature`);
}

for (const relativePath of jpegAssets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required JPEG brand asset: ${relativePath}`);
    continue;
  }
  const data = fs.readFileSync(filePath);
  if (data.length < 1024) failures.push(`${relativePath}: suspiciously small production raster asset`);
  if (!(data[0] === 0xff && data[1] === 0xd8 && data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9)) failures.push(`${relativePath}: not a valid JPEG signature`);
}

const configPath = path.join(root, 'src', 'config', 'brand-assets.ts');
const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
for (const expected of ['/images/brand/sag-official-seal-2026.svg', '/images/brand/institute-crest.svg']) {
  if (!config.includes(expected)) failures.push(`brand asset registry does not reference ${expected}`);
}

const sealWrapper = fs.readFileSync(path.join(root, 'public', 'images', 'brand', 'sag-official-seal-2026.svg'), 'utf8');
if (!sealWrapper.includes('/images/brand/sag-official-seal-2026.png')) failures.push('approved SAG seal wrapper does not reference the approved seal PNG');
const heroWrapper = fs.readFileSync(path.join(root, 'public', 'images', 'brand', 'maritime-hero-v20.svg'), 'utf8');
if (!heroWrapper.includes('/images/brand/sag-maritime-hero-2026.jpeg')) failures.push('homepage maritime wrapper does not reference the approved hero JPEG');

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

console.log(`Brand asset validation passed: ${svgAssets.length} required SVG assets, ${pngAssets.length} approved PNG master, ${jpegAssets.length} approved JPEG master, footer-only VetCert controls, and attribution controls verified.`);
