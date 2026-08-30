import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const distRoot = new URL('../dist/', import.meta.url);
const requiredIdentifierValues = new Map([
  ['UEI', 'RCUUJLWEBGD4'],
  ['CAGE', '16NM4']
]);
const requiredContactPoints = new Map([
  ['general inquiries', 'info@safetyassuranceglobal.com'],
  ['secondary contact', 'contact@safetyassuranceglobal.com'],
  ['Institute and Academy inquiries', 'academy@safetyassuranceglobal.com'],
  ['SAG Command inquiries', 'command@safetyassuranceglobal.com']
]);

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

function extractJsonLd(html) {
  const scripts = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) scripts.push(match[1].trim());
  return scripts;
}
function findGraphNode(graph, type) { return graph.find((node) => node && node['@type'] === type); }

function validateGraph(data, route, errors) {
  if (data?.['@context'] !== 'https://schema.org') errors.push(`${route}: JSON-LD @context must be https://schema.org`);
  if (!Array.isArray(data?.['@graph'])) { errors.push(`${route}: JSON-LD must contain an @graph array`); return; }
  const organization = findGraphNode(data['@graph'], 'Organization');
  const website = findGraphNode(data['@graph'], 'WebSite');
  const breadcrumb = findGraphNode(data['@graph'], 'BreadcrumbList');
  if (!organization) errors.push(`${route}: missing Organization node`);
  if (!website) errors.push(`${route}: missing WebSite node`);
  if (organization) {
    if (organization.legalName !== 'Safety Assurance Global LLC') errors.push(`${route}: Organization legalName mismatch`);
    if (organization.naics !== '541611') errors.push(`${route}: Organization primary NAICS mismatch`);
    if (organization.address?.addressRegion !== 'Oregon' || organization.address?.addressCountry !== 'US') errors.push(`${route}: Organization business-base address mismatch`);
    const identifiers = new Map((organization.identifier ?? []).map((item) => [item?.name, item?.value]));
    for (const [name, expected] of requiredIdentifierValues) if (identifiers.get(name) !== expected) errors.push(`${route}: Organization ${name} identifier mismatch`);
    if (organization.department?.name !== 'Safety Assurance Global Institute of Assurance') errors.push(`${route}: Institute department relationship missing or changed`);
    if (organization.email !== 'info@safetyassuranceglobal.com') errors.push(`${route}: Organization primary email mismatch`);
    if (organization.department?.email !== 'academy@safetyassuranceglobal.com') errors.push(`${route}: Institute department email mismatch`);
    const contacts = new Map((organization.contactPoint ?? []).map((item) => [item?.contactType, item?.email]));
    for (const [type, expectedEmail] of requiredContactPoints) if (contacts.get(type) !== expectedEmail) errors.push(`${route}: Organization contact point ${type} mismatch`);
  }
  if (website?.publisher?.['@id'] !== 'https://safetyassuranceglobal.com/#organization') errors.push(`${route}: WebSite publisher relationship mismatch`);
  const isHome = route === '/';
  if (isHome && breadcrumb) errors.push(`${route}: homepage should not emit BreadcrumbList`);
  if (!isHome && !breadcrumb) errors.push(`${route}: missing BreadcrumbList node`);
  if (breadcrumb) {
    const items = breadcrumb.itemListElement;
    if (!Array.isArray(items) || items.length < 2) errors.push(`${route}: BreadcrumbList requires at least Home and current page`);
    else {
      if (items[0]?.position !== 1 || items[0]?.name !== 'Home' || items[0]?.item !== 'https://safetyassuranceglobal.com/') errors.push(`${route}: BreadcrumbList Home item mismatch`);
      items.forEach((item, index) => { if (item?.position !== index + 1) errors.push(`${route}: BreadcrumbList positions must be consecutive`); });
    }
  }
}

function routeFor(file, rootPath) {
  const rel = relative(rootPath, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

const rootPath = distRoot.pathname;
let files;
try { files = await collectHtmlFiles(rootPath); }
catch (error) { console.error('Structured-data validation failed: dist/ is missing. Run the Astro build first.'); process.exitCode = 1; throw error; }
const errors = [];
let scriptsValidated = 0;
for (const file of files) {
  const route = routeFor(file, rootPath);
  const html = await readFile(file, 'utf8');
  const scripts = extractJsonLd(html);
  if (scripts.length === 0) { errors.push(`${route}: no application/ld+json script found`); continue; }
  let graphFound = false;
  for (const raw of scripts) {
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch (error) { errors.push(`${route}: invalid JSON-LD (${error.message})`); continue; }
    scriptsValidated += 1;
    if (Array.isArray(parsed?.['@graph'])) { graphFound = true; validateGraph(parsed, route, errors); }
  }
  if (!graphFound) errors.push(`${route}: structured-data graph not found`);
}
if (errors.length) {
  console.error(`Structured-data validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Structured-data validation passed: ${files.length} HTML pages, ${scriptsValidated} JSON-LD scripts checked.`);
