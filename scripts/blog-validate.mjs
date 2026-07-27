#!/usr/bin/env node
import {
  BLOG_DIR,
  ALLOWED_STATUSES,
  loadMarkdownRecords,
  normalizeSlug,
  normalizeTaxonomy,
  isNonEmptyString,
  hasValidDate,
  toDate,
  requiresClaimsReview,
  isReviewBlockValid,
  getCanonical
} from './lib/blog-governance-utils.mjs';

const records = loadMarkdownRecords(BLOG_DIR);
const now = new Date();
let hasErrors = false;

const requiredFields = [
  'title',
  'slug',
  'description',
  'author',
  'publishedAt',
  'status',
  'category',
  'tags',
  'featured',
  'source',
  'claimsReview',
  'legalReview',
  'executiveApproval',
  'redirectFrom'
];

const slugMap = new Map();
const normalizedCategoryMap = new Map();
const normalizedTagMap = new Map();
const canonicalMap = new Map();

if (records.length === 0) {
  console.log('No blog records found.');
  process.exit(0);
}

for (const record of records) {
  const errors = [];
  const data = record.data;

  for (const field of requiredFields) {
    if (data[field] === undefined) {
      errors.push(`missing required field: ${field}`);
    }
  }

  if (!isNonEmptyString(data.title)) {
    errors.push('title must be a non-empty string');
  }

  if (!isNonEmptyString(data.slug)) {
    errors.push('slug must be a non-empty string');
  } else {
    const normalizedSlug = normalizeSlug(data.slug);
    if (normalizedSlug !== data.slug) {
      errors.push('slug must already be normalized (lowercase kebab-case)');
    }

    const existing = slugMap.get(data.slug);
    if (existing && existing !== record.relativePath) {
      errors.push(`duplicate slug detected with ${existing}`);
    } else {
      slugMap.set(data.slug, record.relativePath);
    }
  }

  if (!isNonEmptyString(data.description)) {
    errors.push('description must be a non-empty string');
  }

  if (!isNonEmptyString(data.author)) {
    errors.push('author must be a non-empty string');
  }

  if (!hasValidDate(data.publishedAt)) {
    errors.push('publishedAt must be a valid date');
  }

  if (data.updatedAt !== undefined && !hasValidDate(data.updatedAt)) {
    errors.push('updatedAt must be a valid date when provided');
  }

  if (!ALLOWED_STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push('tags must be a non-empty array');
  }

  if (typeof data.featured !== 'boolean') {
    errors.push('featured must be a boolean');
  }

  if (!isNonEmptyString(data.source)) {
    errors.push('source must be a non-empty string');
  }

  if (!isReviewBlockValid(data.claimsReview)) {
    errors.push('claimsReview block is missing or malformed');
  }

  if (!isReviewBlockValid(data.legalReview)) {
    errors.push('legalReview block is missing or malformed');
  }

  if (!isReviewBlockValid(data.executiveApproval)) {
    errors.push('executiveApproval block is missing or malformed');
  }

  if (!Array.isArray(data.redirectFrom)) {
    errors.push('redirectFrom must be an array');
  } else {
    const redirectSet = new Set();
    for (const redirect of data.redirectFrom) {
      if (!isNonEmptyString(redirect) || !redirect.startsWith('/')) {
        errors.push('redirectFrom entries must be non-empty absolute paths');
        continue;
      }

      if (redirectSet.has(redirect)) {
        errors.push(`duplicate redirectFrom path '${redirect}'`);
      }
      redirectSet.add(redirect);
    }
  }

  if (isNonEmptyString(data.category)) {
    const normalizedCategory = normalizeTaxonomy(data.category);
    const seenCategory = normalizedCategoryMap.get(normalizedCategory);
    if (seenCategory && seenCategory !== data.category) {
      errors.push(`category normalization conflict: '${data.category}' collides with '${seenCategory}'`);
    } else {
      normalizedCategoryMap.set(normalizedCategory, data.category);
    }
  }

  if (Array.isArray(data.tags)) {
    for (const tag of data.tags) {
      if (!isNonEmptyString(tag)) {
        errors.push('all tags must be non-empty strings');
        continue;
      }

      const normalizedTag = normalizeTaxonomy(tag);
      const seenTag = normalizedTagMap.get(normalizedTag);
      if (seenTag && seenTag !== tag) {
        errors.push(`tag normalization conflict: '${tag}' collides with '${seenTag}'`);
      } else {
        normalizedTagMap.set(normalizedTag, tag);
      }
    }
  }

  if (isNonEmptyString(data.image) && !isNonEmptyString(data.imageAlt)) {
    errors.push('imageAlt is required when image is provided');
  }

  const canonical = getCanonical(record);
  const existingCanonical = canonicalMap.get(canonical);
  if (existingCanonical && existingCanonical !== record.relativePath) {
    errors.push(`duplicate canonical URL detected with ${existingCanonical}`);
  } else {
    canonicalMap.set(canonical, record.relativePath);
  }

  const claimsRequired = requiresClaimsReview(record);
  if (claimsRequired && data.claimsReview?.required !== true) {
    errors.push('claimsReview.required must be true for claim-sensitive content');
  }

  if (data.status === 'published') {
    const publishedAt = toDate(data.publishedAt);
    if (publishedAt.getTime() > now.getTime()) {
      errors.push('publishedAt cannot be in the future for published content');
    }

    if (data.claimsReview?.required === true && data.claimsReview?.disposition !== 'approved') {
      errors.push('published content requiring claims review must have claimsReview.disposition = approved');
    }

    if (data.claimsReview?.required === true && (!data.claimsReview?.reviewer || !data.claimsReview?.reviewedAt)) {
      errors.push('published content requiring claims review must include claims reviewer and reviewedAt');
    }

    if (data.executiveApproval?.required === true && data.executiveApproval?.disposition !== 'approved') {
      errors.push('published content requiring executive approval must have executiveApproval.disposition = approved');
    }
  }

  if (['draft', 'internal-review', 'claims-review', 'legal-review', 'executive-review'].includes(data.status)) {
    if (!isNonEmptyString(data.draftReason)) {
      errors.push('draftReason is required for non-public workflow states');
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`FAIL  ${record.relativePath}: ${error}`);
    }
    hasErrors = true;
  } else {
    console.log(`PASS  ${record.relativePath}`);
  }
}

if (hasErrors) {
  console.error('\nBlog validation failed.');
  process.exit(1);
}

console.log(`\nAll ${records.length} blog file(s) passed governance validation.`);
