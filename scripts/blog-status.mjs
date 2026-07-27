#!/usr/bin/env node
import {
  BLOG_DIR,
  ALLOWED_STATUSES,
  loadMarkdownRecords,
  isNonEmptyString,
  toDate,
  hasValidDate
} from './lib/blog-governance-utils.mjs';

const records = loadMarkdownRecords(BLOG_DIR);
let hasErrors = false;
const counts = new Map();
const now = new Date();

if (records.length === 0) {
  console.log('No blog records found.');
  process.exit(0);
}

for (const record of records) {
  const status = String(record.data.status ?? '').trim();
  counts.set(status, (counts.get(status) ?? 0) + 1);

  if (!ALLOWED_STATUSES.includes(status)) {
    console.error(`FAIL  ${record.relativePath}: invalid status '${status}'`);
    hasErrors = true;
  }

  if (!hasValidDate(record.data.publishedAt)) {
    console.error(`FAIL  ${record.relativePath}: invalid publishedAt date`);
    hasErrors = true;
  }

  if (status === 'published') {
    const publishedAt = toDate(record.data.publishedAt);
    if (publishedAt.getTime() > now.getTime()) {
      console.error(`FAIL  ${record.relativePath}: publishedAt cannot be in the future for published content`);
      hasErrors = true;
    }
  }

  if (['draft', 'internal-review', 'claims-review', 'legal-review', 'executive-review'].includes(status)) {
    if (!isNonEmptyString(record.data.draftReason)) {
      console.error(`FAIL  ${record.relativePath}: draftReason is required for non-public workflow states`);
      hasErrors = true;
    }
  }

  console.log(`PASS  ${record.relativePath}`);
}

console.log('\nStatus counts:');
for (const status of ALLOWED_STATUSES) {
  console.log(`- ${status}: ${counts.get(status) ?? 0}`);
}

if (hasErrors) {
  console.error('\nPublication-status validation failed.');
  process.exit(1);
}

console.log('\nPublication-status validation passed.');
