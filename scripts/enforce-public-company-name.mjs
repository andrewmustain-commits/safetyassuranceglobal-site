import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');

if (!fs.existsSync(dist)) {
  console.error('Full-name enforcement failed: dist/ does not exist.');
  process.exit(1);
}

const protectedBrandNames = [
  'SAG Command',
  'SAG Academy',
  'SAG SECURE'
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

const protectBrands = (value) => {
  let output = value;
  protectedBrandNames.forEach((brand, index) => {
    output = output.split(brand).join(`__SAFETY_ASSURANCE_GLOBAL_PROTECTED_BRAND_${index}__`);
  });
  return output;
};

const decodeEntities = (value) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&rsquo;|&#8217;/gi, '’')
  .replace(/&ldquo;|&#8220;/gi, '“')
  .replace(/&rdquo;|&#8221;/gi, '”');

const stripNonPublicBlocks = (html) => html
  .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--([\s\S]*?)-->/g, ' ');

const collectPublicStrings = (html) => {
  const cleaned = stripNonPublicBlocks(html);
  const values = [];

  const textOnly = cleaned.replace(/<[^>]+>/g, ' ');
  values.push({ field: 'visible text', value: textOnly });

  for (const match of cleaned.matchAll(/\b(?:alt|title|aria-label|placeholder)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    values.push({ field: 'public attribute', value: match[1] ?? match[2] ?? '' });
  }

  for (const meta of cleaned.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = meta[0];
    const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (content) values.push({ field: 'metadata', value: content[1] ?? content[2] ?? '' });
  }

  return values;
};

const failures = [];

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(dist, filePath);

  for (const { field, value } of collectPublicStrings(html)) {
    const candidate = protectBrands(decodeEntities(value));
    const match = candidate.match(/\bSAG\b/);
    if (!match) continue;

    const index = match.index ?? 0;
    const start = Math.max(0, index - 70);
    const end = Math.min(candidate.length, index + 110);
    const context = candidate.slice(start, end).replace(/\s+/g, ' ').trim();
    failures.push(`${relativePath} (${field}): …${context}…`);
  }
}

if (failures.length) {
  console.error('Full-name enforcement failed. Replace ordinary public company shorthand with “Safety Assurance Global”.');
  console.error('Protected formal product names may retain their approved names. Generated files were not modified.');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Full-name enforcement passed for ${htmlFiles.length} generated HTML pages. Validation only; no generated HTML was rewritten.`);
