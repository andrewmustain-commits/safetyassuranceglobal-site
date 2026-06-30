import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const blogDir = path.resolve('src/content/blog');
const files = (await readdir(blogDir)).filter((file) => file.endsWith('.md'));

for (const file of files) {
  const content = await readFile(path.join(blogDir, file), 'utf8');
  const lines = content.split(/\r?\n/);

  if (lines[0] !== '---') {
    throw new Error(`Missing frontmatter opening in ${file}`);
  }

  const closingIndex = lines.findIndex((line, i) => i > 0 && line === '---');
  if (closingIndex === -1) {
    throw new Error(`Unclosed frontmatter block in ${file}`);
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const statusLine = frontmatterLines.find((line) => line.startsWith('status:'));

  if (!statusLine) {
    throw new Error(`Missing status frontmatter in ${file}`);
  }

  const status = statusLine.replace('status:', '').trim();
  if (!['approved', 'draft'].includes(status)) {
    throw new Error(`Invalid status '${status}' in ${file}`);
  }
}

console.log(`Validated ${files.length} blog markdown file(s).`);
