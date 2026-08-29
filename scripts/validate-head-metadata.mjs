import { access, readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const distRoot = new URL('../dist/', import.meta.url);
const distPath = distRoot.pathname;
const siteOrigin = 'https://safetyassuranceglobal.com';
const requiredFavicon = '/images/brand/sag-icon.svg';
const forbiddenAssetNames = [
  '/favicon.ico',
  '/images/brand/favicon.ico',
  '/images/brand/favicon.png',
  '/images/brand/apple-touch-icon.png',
  '/images/brand/sag-brand-artwork-registered.png',
  '/images/brand/social-card.png',
  '/social-card-default.png'
];

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function routeFor(file) {
  const rel = relative(distPath, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
}

function findTag(html, selector) {
  if (selector.type === 'meta') {
    const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
    return tags.find((tag) => attr(tag, selector.attr) === selector.value) ?? null;
  }
  if (selector.type === 'link') {
    const tags = html.match(/<link\b[^>]*>/gi) ?? [];
    return tags.find((tag) => attr(tag, selector.attr) === selector.value) ?? null;
  }
  return null;
}

function titleText(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match?.[1]?.trim() ?? '';
}

async function validateLocalImage(imageUrl, route, errors) {
  let url;
  try {
    url = new URL(imageUrl, siteOrigin);
  } catch {
    errors.push(`${route}: social image URL is invalid: ${imageUrl}`);
    return;
  }
  if (url.origin !== siteOrigin) return;
  const pathname = decodeURIComponent(url.pathname);
  const filePath = join(distPath, pathname.replace(/^\//, ''));
  try {
    await access(filePath);
    const info = await stat(filePath);
    if (!info.isFile() || info.size < 100) {
      errors.push(`${route}: local social image is missing usable content: ${pathname}`);
    }
  } catch {
    errors.push(`${route}: local social image does not exist in dist: ${pathname}`);
  }
}

let files;
try {
  files = await collectHtmlFiles(distPath);
} catch (error) {
  console.error('Head-metadata validation failed: dist/ is missing. Run the Astro build first.');
  process.exitCode = 1;
  throw error;
}

const errors = [];
for (const file of files) {
  const route = routeFor(file);
  const html = await readFile(file, 'utf8');

  const title = titleText(html);
  if (!title) errors.push(`${route}: missing or empty <title>`);

  const descriptionTag = findTag(html, { type: 'meta', attr: 'name', value: 'description' });
  const description = descriptionTag ? attr(descriptionTag, 'content')?.trim() : null;
  if (!description) errors.push(`${route}: missing or empty meta description`);

  const canonicalTag = findTag(html, { type: 'link', attr: 'rel', value: 'canonical' });
  const canonical = canonicalTag ? attr(canonicalTag, 'href')?.trim() : null;
  if (!canonical) {
    errors.push(`${route}: missing canonical link`);
  } else {
    try {
      const canonicalUrl = new URL(canonical);
      if (canonicalUrl.origin !== siteOrigin) errors.push(`${route}: canonical must use ${siteOrigin}`);
      if (canonicalUrl.search || canonicalUrl.hash) errors.push(`${route}: canonical must not contain query or fragment`);
    } catch {
      errors.push(`${route}: canonical URL is invalid`);
    }
  }

  const faviconTag = findTag(html, { type: 'link', attr: 'rel', value: 'icon' });
  const favicon = faviconTag ? attr(faviconTag, 'href') : null;
  if (favicon !== requiredFavicon) {
    errors.push(`${route}: favicon must be ${requiredFavicon}`);
  }

  for (const forbidden of forbiddenAssetNames) {
    if (html.includes(forbidden)) errors.push(`${route}: references removed placeholder asset ${forbidden}`);
  }

  const ogUrlTag = findTag(html, { type: 'meta', attr: 'property', value: 'og:url' });
  const ogUrl = ogUrlTag ? attr(ogUrlTag, 'content')?.trim() : null;
  if (!ogUrl) errors.push(`${route}: missing og:url`);
  else if (canonical && ogUrl !== canonical) errors.push(`${route}: og:url must equal canonical`);

  const ogImageTag = findTag(html, { type: 'meta', attr: 'property', value: 'og:image' });
  const ogImage = ogImageTag ? attr(ogImageTag, 'content')?.trim() : null;
  const twitterImageTag = findTag(html, { type: 'meta', attr: 'name', value: 'twitter:image' });
  const twitterImage = twitterImageTag ? attr(twitterImageTag, 'content')?.trim() : null;
  const twitterCardTag = findTag(html, { type: 'meta', attr: 'name', value: 'twitter:card' });
  const twitterCard = twitterCardTag ? attr(twitterCardTag, 'content')?.trim() : null;

  if (ogImage) {
    if (!twitterImage) errors.push(`${route}: og:image requires twitter:image`);
    if (twitterImage && twitterImage !== ogImage) errors.push(`${route}: twitter:image must match og:image`);
    if (twitterCard !== 'summary_large_image') errors.push(`${route}: pages with a social image must use summary_large_image`);
    await validateLocalImage(ogImage, route, errors);
  } else {
    if (twitterImage) errors.push(`${route}: twitter:image must not be emitted without og:image`);
    if (twitterCard !== 'summary') errors.push(`${route}: pages without a social image must use summary`);
  }
}

if (errors.length) {
  console.error(`Head-metadata validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Head-metadata validation passed: ${files.length} HTML pages checked.`);
