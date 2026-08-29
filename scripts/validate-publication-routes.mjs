import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const contentDir = path.join(root, 'src', 'content', 'blog');
const distDir = path.join(root, 'dist');
const redirectsPath = path.join(root, 'public', '_redirects');
const redirects = fs.readFileSync(redirectsPath, 'utf8');
const failures = [];

for (const filename of fs.readdirSync(contentDir).filter((name) => name.endsWith('.md'))) {
  const source = fs.readFileSync(path.join(contentDir, filename), 'utf8');
  const { data } = matter(source);
  const slug = String(data.slug ?? path.basename(filename, '.md')).trim();
  const status = String(data.status ?? '').trim();
  const generatedPath = path.join(distDir, 'insights', slug, 'index.html');
  const generated = fs.existsSync(generatedPath);

  if (status === 'published' && !generated) failures.push(`${filename}: published route missing`);
  if (status !== 'published' && generated) failures.push(`${filename}: non-published route generated`);

  const redirectFrom = Array.isArray(data.redirectFrom) ? data.redirectFrom : [];
  if (status !== 'published') {
    for (const legacyPath of redirectFrom) {
      const normalized = String(legacyPath).trim();
      if (!normalized) continue;
      const withoutSlash = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
      const explicitlyGated = redirects.split(/\r?\n/).some((line) => line.startsWith(`${normalized} `) || line.startsWith(`${withoutSlash} `));
      if (!explicitlyGated) failures.push(`${filename}: legacy route ${normalized} lacks explicit gate`);
    }
  }
}

if (failures.length) {
  console.error('Publication route validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Publication route validation passed.');
