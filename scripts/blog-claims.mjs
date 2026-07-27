#!/usr/bin/env node
import { BLOG_DIR, loadMarkdownRecords, requiresClaimsReview, isReviewBlockValid } from './lib/blog-governance-utils.mjs';

const records = loadMarkdownRecords(BLOG_DIR);
let hasErrors = false;

if (records.length === 0) {
  console.log('No blog records found.');
  process.exit(0);
}

for (const record of records) {
  let fileError = false;
  const shouldRequireClaims = requiresClaimsReview(record);
  const review = record.data.claimsReview;
  const status = String(record.data.status ?? '').trim();

  if (!isReviewBlockValid(review)) {
    console.error(`FAIL  ${record.relativePath}: claimsReview block is missing or invalid`);
    hasErrors = true;
    fileError = true;
    continue;
  }

  if (shouldRequireClaims && review.required !== true) {
    console.error(`FAIL  ${record.relativePath}: claimsReview.required must be true for claim-sensitive content`);
    hasErrors = true;
    fileError = true;
  }

  if (status === 'published' && shouldRequireClaims) {
    if (review.disposition !== 'approved') {
      console.error(`FAIL  ${record.relativePath}: claim-sensitive published content must have claimsReview.disposition = approved`);
      hasErrors = true;
      fileError = true;
    }

    if (!review.reviewer || !review.reviewedAt) {
      console.error(`FAIL  ${record.relativePath}: claim-sensitive published content must include claims reviewer and reviewedAt`);
      hasErrors = true;
      fileError = true;
    }
  }

  if (!fileError) {
    console.log(`PASS  ${record.relativePath}`);
  }
}

if (hasErrors) {
  console.error('\nClaims review validation failed.');
  process.exit(1);
}

console.log(`\nClaims review validation passed for ${records.length} file(s).`);
