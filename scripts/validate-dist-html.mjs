import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDir = path.resolve('dist');

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
};

const getAttr = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
};

const hasAttr = (tag, name) => new RegExp(`\\s${name}(?:\\s*=|\\s|/?>)`, 'i').test(tag);
const textContent = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const failures = [];
const record = (file, message) => failures.push(`${path.relative(distDir, file)}: ${message}`);

const files = await walk(distDir);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const lower = html.toLowerCase();

  if (!/^\s*<!doctype html>/i.test(html)) record(file, 'missing HTML5 doctype');

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0];
  if (!htmlTag || !getAttr(htmlTag, 'lang')?.trim()) record(file, 'missing non-empty html[lang]');

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (!title || !textContent(title)) record(file, 'missing non-empty <title>');

  if (!/<meta\b[^>]*name=["']viewport["'][^>]*>/i.test(html)) record(file, 'missing viewport meta');
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html) &&
      !/<meta\b[^>]*content=["'][^"']+["'][^>]*name=["']description["'][^>]*>/i.test(html)) {
    record(file, 'missing non-empty meta description');
  }
  if (!/<link\b[^>]*rel=["']canonical["'][^>]*href=["'][^"']+["'][^>]*>/i.test(html) &&
      !/<link\b[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    record(file, 'missing canonical link');
  }

  const mainTags = html.match(/<main\b[^>]*>/gi) ?? [];
  if (mainTags.length !== 1) record(file, `expected exactly one <main>; found ${mainTags.length}`);

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((m) => m[1]);
  const idSet = new Set(ids);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) record(file, `duplicate id(s): ${duplicates.join(', ')}`);

  const skipLinks = [...html.matchAll(/<a\b[^>]*class=["'][^"']*\bskip-link\b[^"']*["'][^>]*>/gi)].map((m) => m[0]);
  if (skipLinks.length !== 1) {
    record(file, `expected exactly one skip link; found ${skipLinks.length}`);
  } else {
    const href = getAttr(skipLinks[0], 'href');
    if (!href?.startsWith('#') || !idSet.has(href.slice(1))) record(file, 'skip link does not target an existing id');
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!hasAttr(tag, 'alt')) record(file, `image missing alt attribute: ${tag.slice(0, 120)}`);
  }

  for (const match of html.matchAll(/\saria-(?:labelledby|describedby|controls)=["']([^"']+)["']/gi)) {
    for (const ref of match[1].trim().split(/\s+/)) {
      if (ref && !idSet.has(ref)) record(file, `ARIA reference points to missing id: ${ref}`);
    }
  }

  for (const tag of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) ?? []) {
    const openTag = tag.match(/<button\b[^>]*>/i)?.[0] ?? '';
    const name = getAttr(openTag, 'aria-label') || getAttr(openTag, 'title') || textContent(tag);
    if (!name?.trim()) record(file, 'button has no accessible text or label');
  }

  if (lower.includes('target="_blank"') || lower.includes("target='_blank'")) {
    for (const tag of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) ?? []) {
      const rel = getAttr(tag, 'rel')?.toLowerCase().split(/\s+/) ?? [];
      if (!rel.includes('noopener')) record(file, 'target=_blank link missing rel=noopener');
    }
  }
}

console.log(`HTML files checked: ${files.length}`);
console.log(`HTML invariant failures: ${failures.length}`);

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Generated HTML invariants passed.');
}
