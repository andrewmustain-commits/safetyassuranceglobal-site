import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function existsForRoute(route) {
  const normalized = route === '/' ? '/index.html' : route.replace(/\/$/, '') + '/index.html';
  return fs.existsSync(path.join(distRoot, normalized));
}

function existsForAsset(link) {
  return fs.existsSync(path.join(distRoot, link));
}

if (!fs.existsSync(distRoot)) {
  console.error('dist/ not found. Run npm run build first.');
  process.exit(1);
}

walk(distRoot);

const routePattern = /(href|src)="([^"]+)"/g;
const links = new Set();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;

  while ((match = routePattern.exec(content))) {
    const value = match[2];
    if (value.startsWith('/') && !value.startsWith('//')) {
      links.add(value.split('#')[0].split('?')[0]);
    }
  }
}

const broken = [];

for (const link of links) {
  if (link.startsWith('/images/') || link === '/favicon.ico' || link.startsWith('/_astro/')) {
    continue;
  }

  if (link === '/rss.xml') {
    continue;
  }

  // If the link points to a file asset, verify file existence instead of route existence.
  if (path.extname(link)) {
    if (!existsForAsset(link)) {
      broken.push(link);
    }
    continue;
  }

  if (!existsForRoute(link)) {
    broken.push(link);
  }
}

console.log(`Built routes: ${htmlFiles.length}`);
console.log(`Broken internal links: ${broken.length}`);

for (const link of broken) {
  console.log(link);
}

if (broken.length > 0) {
  process.exitCode = 1;
}