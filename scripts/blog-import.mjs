#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  BLOG_DIR,
  INTAKE_DIR,
  IMPORT_REPORT_DIR,
  ALLOWED_STATUSES,
  normalizeSlug,
  ensureDir,
  loadMarkdownRecords,
  requiresClaimsReview
} from './lib/blog-governance-utils.mjs';

const inputArg = process.argv.slice(2).find((arg) => !arg.startsWith('-'));

if (!inputArg) {
  console.error('Usage: npm run blog:import -- <path-to-markdown-file-or-directory>');
  process.exit(1);
}

const sourcePath = path.resolve(inputArg);
if (!fs.existsSync(sourcePath)) {
  console.error(`Input path not found: ${sourcePath}`);
  process.exit(1);
}

const collectMarkdownFiles = (targetPath) => {
  const stats = fs.statSync(targetPath);
  if (stats.isFile()) {
    return targetPath.endsWith('.md') ? [targetPath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
};

const intakeFiles = collectMarkdownFiles(sourcePath);
if (intakeFiles.length === 0) {
  console.error('No markdown files found in the provided path.');
  process.exit(1);
}

const existingRecords = loadMarkdownRecords(BLOG_DIR);
const existingSlugs = new Set(existingRecords.map((record) => String(record.data.slug).trim()));

const importPlan = [];
const errors = [];

for (const filePath of intakeFiles) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const input = parsed.data;

  const title = String(input.title ?? '').trim();
  const candidateSlug = String(input.slug ?? normalizeSlug(title)).trim();
  const slug = normalizeSlug(candidateSlug);

  if (!title) {
    errors.push(`${filePath}: missing required frontmatter field 'title'`);
    continue;
  }

  if (!slug) {
    errors.push(`${filePath}: could not derive a valid slug`);
    continue;
  }

  if (existingSlugs.has(slug) || importPlan.some((item) => item.slug === slug)) {
    errors.push(`${filePath}: duplicate slug '${slug}'`);
    continue;
  }

  const sourceStatus = String(input.status ?? 'draft').trim();
  if (sourceStatus === 'published') {
    errors.push(`${filePath}: intake content may not use status 'published'`);
    continue;
  }

  if (sourceStatus && !ALLOWED_STATUSES.includes(sourceStatus)) {
    errors.push(`${filePath}: invalid status '${sourceStatus}'`);
    continue;
  }

  const description = String(input.description ?? input.summary ?? '').trim();
  if (!description) {
    errors.push(`${filePath}: missing required frontmatter field 'description' (or summary fallback)`);
    continue;
  }

  const author = String(input.author ?? '').trim();
  if (!author) {
    errors.push(`${filePath}: missing required frontmatter field 'author'`);
    continue;
  }

  const publishedAt = String(input.publishedAt ?? input.date ?? new Date().toISOString().slice(0, 10)).trim();
  const category = String(input.category ?? 'Governance').trim();
  const tags = Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];

  if (tags.length === 0) {
    errors.push(`${filePath}: tags must contain at least one value`);
    continue;
  }

  const draftStatus = sourceStatus && sourceStatus !== 'published' ? sourceStatus : 'draft';
  const claimsRequired = requiresClaimsReview({ data: { title, description, category, tags }, body: parsed.content });

  const frontmatter = {
    title,
    slug,
    description,
    author,
    publishedAt,
    status: ['internal-review', 'claims-review', 'legal-review', 'executive-review'].includes(draftStatus)
      ? draftStatus
      : 'draft',
    category,
    tags,
    featured: false,
    source: String(input.source ?? `Imported via governed intake from ${path.relative(process.cwd(), filePath)}`),
    claimsReview: {
      required: claimsRequired,
      disposition: claimsRequired ? 'pending' : 'not-required'
    },
    legalReview: {
      required: false,
      disposition: 'not-required'
    },
    executiveApproval: {
      required: false,
      disposition: 'pending'
    },
    draftReason: 'Imported from controlled intake. Pending editorial and governance review before publication.',
    redirectFrom: []
  };

  if (input.image) {
    const imageValue = String(input.image).trim();
    if (imageValue.startsWith('http')) {
      errors.push(`${filePath}: external image URLs are not allowed in intake frontmatter`);
      continue;
    }

    const sourceImagePath = path.resolve(path.dirname(filePath), imageValue);
    if (!fs.existsSync(sourceImagePath)) {
      errors.push(`${filePath}: referenced image does not exist at ${sourceImagePath}`);
      continue;
    }

    const imageName = path.basename(sourceImagePath);
    frontmatter.image = `/images/insights/imports/${slug}/${imageName}`;
    frontmatter.imageAlt = String(input.imageAlt ?? '').trim();

    if (!frontmatter.imageAlt) {
      errors.push(`${filePath}: imageAlt is required when image is provided`);
      continue;
    }

    importPlan.push({
      filePath,
      slug,
      frontmatter,
      body: parsed.content.trim(),
      imageSource: sourceImagePath,
      imageName
    });
    continue;
  }

  importPlan.push({
    filePath,
    slug,
    frontmatter,
    body: parsed.content.trim(),
    imageSource: null,
    imageName: null
  });
}

if (errors.length > 0) {
  console.error('Import validation failed. No files were written.');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

ensureDir(BLOG_DIR);
ensureDir(IMPORT_REPORT_DIR);

const written = [];
for (const item of importPlan) {
  const targetMarkdown = path.join(BLOG_DIR, `${item.slug}.md`);

  if (fs.existsSync(targetMarkdown)) {
    console.error(`Import aborted: target file already exists (${targetMarkdown}).`);
    process.exit(1);
  }

  if (item.imageSource) {
    const imageDir = path.resolve('public', 'images', 'insights', 'imports', item.slug);
    ensureDir(imageDir);
    fs.copyFileSync(item.imageSource, path.join(imageDir, item.imageName));
  }

  const output = matter.stringify(item.body || 'Draft body pending editorial enhancement.', item.frontmatter);
  fs.writeFileSync(targetMarkdown, output, 'utf8');

  written.push({
    source: path.relative(process.cwd(), item.filePath),
    target: path.relative(process.cwd(), targetMarkdown),
    slug: item.slug,
    status: item.frontmatter.status
  });
}

const report = {
  importedAt: new Date().toISOString(),
  sourcePath: path.relative(process.cwd(), sourcePath),
  intakeRoot: path.relative(process.cwd(), INTAKE_DIR),
  importedCount: written.length,
  records: written
};

const reportPath = path.join(
  IMPORT_REPORT_DIR,
  `blog-import-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`Imported ${written.length} markdown file(s).`);
for (const item of written) {
  console.log(`- ${item.source} -> ${item.target} (${item.status})`);
}
console.log(`Report written to ${path.relative(process.cwd(), reportPath)}`);
