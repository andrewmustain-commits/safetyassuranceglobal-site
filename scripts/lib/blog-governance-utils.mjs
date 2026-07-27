import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const BLOG_DIR = path.resolve('src/content/blog');
export const INTAKE_DIR = path.resolve('content/intake');
export const IMPORT_REPORT_DIR = path.resolve('docs/website/reports');

export const ALLOWED_STATUSES = [
  'draft',
  'internal-review',
  'claims-review',
  'legal-review',
  'executive-review',
  'approved',
  'published',
  'archived'
];

export const REVIEW_DISPOSITIONS = ['pending', 'approved', 'rejected', 'not-required'];

export const CLAIMS_KEYWORDS = [
  'law',
  'regulation',
  'regulatory deadline',
  'government',
  'agency',
  'contract',
  'certification',
  'accreditation',
  'standard',
  'customer',
  'performance',
  'safety outcome',
  'cybersecurity',
  'training recognition',
  'software capability'
];

export const normalizeSlug = (value) =>
  String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const normalizeTaxonomy = (value) => normalizeSlug(value);

export const listMarkdownFiles = (directory) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files.sort();
};

export const loadMarkdownRecords = (directory) =>
  listMarkdownFiles(directory).map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);

    return {
      filePath,
      relativePath: path.relative(process.cwd(), filePath),
      data: parsed.data,
      body: parsed.content,
      raw
    };
  });

export const hasValidDate = (value) => {
  const date = toDate(value);
  return !Number.isNaN(date.getTime());
};

export const toDate = (value) => {
  if (value instanceof Date) {
    return value;
  }

  return new Date(String(value));
};

export const requiresClaimsReview = (record) => {
  const haystack = [
    record.data?.title,
    record.data?.description,
    record.data?.category,
    ...(Array.isArray(record.data?.tags) ? record.data.tags : []),
    record.body
  ]
    .join(' ')
    .toLowerCase();

  return CLAIMS_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

export const getCanonical = (record, siteOrigin = 'https://safetyassuranceglobal.com') => {
  const canonical = String(record.data?.canonical ?? '').trim();
  if (canonical) {
    return canonical;
  }

  return `${siteOrigin}/insights/${record.data.slug}/`;
};

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const isReviewBlockValid = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  if (typeof value.required !== 'boolean') {
    return false;
  }

  if (!REVIEW_DISPOSITIONS.includes(value.disposition)) {
    return false;
  }

  return true;
};

export const ensureDir = (directory) => {
  fs.mkdirSync(directory, { recursive: true });
};
