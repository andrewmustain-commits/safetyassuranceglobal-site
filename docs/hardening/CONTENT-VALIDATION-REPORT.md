# Content Validation Report (HARDEN-002)

Date: 2026-07-02
Scope: Validation of all repository article files in src/content/blog and content/blog.

## Files Audited
Runtime collection files:
- src/content/blog/assurance-framework-performance.md
- src/content/blog/public-site-launch.md
- src/content/blog/pilot-checklist-draft.md

Staging/legacy files:
- content/blog/approved-launch-update.md
- content/blog/draft-internal-roadmap.md

## Findings

### 1) Required Front Matter and Schema Compliance
Runtime collection (src/content/blog): Pass
- All 3 files satisfy active schema in src/content.config.ts:
  - title, date, author, category, tags, summary, status, source, slug

Validation evidence:
- npm run blog:validate passed all 3 runtime posts.

Staging files (content/blog): Partial/future conversion scope
- Files are in legacy 4-field format (title, description, pubDate, status).
- Not part of active Astro content collection loader.
- Not schema-compliant for direct publication in current runtime path.

### 2) Category Validity
Status: Pass for runtime files
- Runtime categories observed: Governance, Training
- Both are valid in controlled vocabulary.

### 3) Tag Validity
Status: Pass (baseline)
- Tags are lowercase and concise.
- No obvious duplicates or malformed tag arrays.

### 4) Slug Uniqueness
Status: Pass for runtime files
- public-site-launch
- measuring-assurance-framework-performance
- pilot-checklist-for-assurance-workshops
- No collisions found in src/content/blog.

### 5) Internal/External Links in Articles
Status: Pass / none-to-validate
- Runtime markdown bodies include no inline URL links that fail validation.
- No broken markdown link syntax detected.

### 6) Image References and Alt Text
Status: Pass / not used
- No markdown image references detected in audited article bodies.
- Alt text checks are not applicable where no images are present.

### 7) Draft/Approved Status Controls
Status: Pass
- Approved runtime articles are renderable.
- Draft runtime article is excluded from public listing/routes.
- Draft staging file remains outside runtime collection.

### 8) Reading Consistency
Status: Partial pass
- Runtime articles are readable and coherent.
- Length/depth consistency varies (for example one approved post is very short), which is editorial quality risk rather than schema risk.

## Risks
1. Legacy staging files are not publish-ready under active schema and could be misused if moved without conversion.
2. Content depth inconsistency may reduce perceived quality/authority.

## Recommendations
1. Continue conversion of approved staging content through governed migration process before runtime placement.
2. Keep draft content lifecycle controls unchanged.
3. Add editorial minimum-length or section-depth guidance to reduce quality variance.

## Validation Evidence
- npm run blog:validate: PASS for runtime files.
