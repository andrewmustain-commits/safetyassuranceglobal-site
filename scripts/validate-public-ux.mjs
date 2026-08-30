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

for (const filePath of htmlFiles) {
  const relative = path.relative(dist, filePath);
  const html = fs.readFileSync(filePath, 'utf8');

  for (const phrase of forbiddenPublicPhrases) {
    if (html.includes(phrase)) failures.push(`${relative}: internal-only public text detected: ${phrase}`);
  }

  const anchors = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>/gi)];
  for (const match of anchors) {
    const href = match[2].trim();
    if (!href || href === '#' || /^javascript:/i.test(href)) {
      failures.push(`${relative}: dead or placeholder anchor href detected: ${JSON.stringify(href)}`);
    }
  }

  const ids = [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]).filter(Boolean);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) failures.push(`${relative}: duplicate id detected: ${id}`);
    seen.add(id);
  }

  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const image of images) {
    if (!/\balt\s*=\s*(["']).*?\1/i.test(image[0])) failures.push(`${relative}: image missing alt attribute`);
  }
}

if (failures.length) {
  console.error('Public UX validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public UX validation passed for ${htmlFiles.length} generated HTML pages: no internal legal-review notes, dead anchors, duplicate IDs, or images without alt attributes.`);
