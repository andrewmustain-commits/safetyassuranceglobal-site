import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const indexPath = path.join(dist, 'sitemap-index.xml');
const siteOrigin = 'https://safetyassuranceglobal.com';
const requiredPaths = [
  '/',
  '/maritime/',
  '/services/',
  '/capabilities/',
  '/institute/',
  '/training/',
  '/industries/',
  '/government/',
  '/about/',
  '/insights/',
  '/contact/',
  '/request-proposal/',
  '/method/'
];
const forbiddenPaths = [
  '/academy/',
  '/command/',
  '/terms/',
  '/blog/',
  '/insights/infrastructure-of-integrity-risk-governance/'
];
const failures = [];

if (!fs.existsSync(indexPath)) {
  console.error('Sitemap validation failed: dist/sitemap-index.xml is missing.');
  process.exit(1);
}

const indexXml = fs.readFileSync(indexPath, 'utf8');
const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!sitemapUrls.length) failures.push('sitemap index contains no child sitemap URLs');

const entries = new Set();
for (const sitemapUrl of sitemapUrls) {
  let url;
  try {
    url = new URL(sitemapUrl);
  } catch {
    failures.push(`invalid child sitemap URL: ${sitemapUrl}`);
    continue;
  }
  if (url.origin !== siteOrigin) failures.push(`child sitemap uses unexpected origin: ${sitemapUrl}`);
  const childName = path.basename(url.pathname);
  const childPath = path.join(dist, childName);
  if (!fs.existsSync(childPath)) {
    failures.push(`referenced child sitemap is missing from dist: ${childName}`);
    continue;
  }
  const childXml = fs.readFileSync(childPath, 'utf8');
  for (const match of childXml.matchAll(/<loc>([^<]+)<\/loc>/g)) entries.add(match[1]);
}

for (const route of requiredPaths) {
  const expected = new URL(route, siteOrigin).href;
  if (!entries.has(expected)) failures.push(`required canonical route missing: ${expected}`);
}

for (const route of forbiddenPaths) {
  const forbidden = new URL(route, siteOrigin).href;
  if (entries.has(forbidden)) failures.push(`legacy or held route must not appear: ${forbidden}`);
}

for (const entry of entries) {
  let url;
  try { url = new URL(entry); } catch { failures.push(`invalid sitemap entry: ${entry}`); continue; }
  if (url.origin !== siteOrigin) failures.push(`unexpected sitemap origin: ${entry}`);
  if (url.search || url.hash) failures.push(`sitemap entry contains query or fragment: ${entry}`);
}

if (failures.length) {
  console.error('Sitemap validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Sitemap validation passed: ${entries.size} canonical URLs checked.`);
