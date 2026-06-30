import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const blogDir = path.resolve('content/blog');
const files = (await readdir(blogDir)).filter((file) => file.endsWith('.md'));

for (const file of files) {
  const content = await readFile(path.join(blogDir, file), 'utf8');
  const statusLine = content.split('\n').find((line) => line.startsWith('status:'));

  if (!statusLine) {
    throw new Error(`Missing status frontmatter in ${file}`);
  }

  const status = statusLine.replace('status:', '').trim();
  if (!['approved', 'draft'].includes(status)) {
    throw new Error(`Invalid status '${status}' in ${file}`);
  }
}

console.log(`Validated ${files.length} blog markdown file(s).`);
