#!/usr/bin/env node
/**
 * Blog frontmatter validation script.
 * Validates all Markdown files in src/content/blog/ against the required schema.
 *
 * Rules:
 * - All required fields must be present.
 * - status must be "approved" or "draft".
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, '..', 'src', 'content', 'blog');

const REQUIRED_FIELDS = ['title', 'date', 'author', 'category', 'tags', 'summary', 'status', 'source', 'slug'];
const VALID_STATUSES = ['approved', 'draft'];

let hasErrors = false;

const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

if (files.length === 0) {
  console.log('No blog posts found.');
  process.exit(0);
}

for (const file of files) {
  const content = readFileSync(join(blogDir, file), 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    console.error(`FAIL  ${file}: missing frontmatter block`);
    hasErrors = true;
    continue;
  }

  const frontmatter = match[1];
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!new RegExp(`^${field}:`, 'm').test(frontmatter)) {
      errors.push(`missing required field: ${field}`);
    }
  }

  const statusMatch = frontmatter.match(/^status:\s*(.+)$/m);
  if (statusMatch) {
    const status = statusMatch[1].trim().replace(/^["']|["']$/g, '');
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`invalid status "${status}" — must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    for (const err of errors) {
      console.error(`FAIL  ${file}: ${err}`);
    }
    hasErrors = true;
  } else {
    console.log(`PASS  ${file}`);
  }
}

if (hasErrors) {
  console.error(`\nBlog validation failed.`);
  process.exit(1);
}

console.log(`\nAll ${files.length} blog post(s) passed validation.`);
