# Content Discovery Readiness (CONTENT-004)

Report date: 2026-07-02
Scope: Blog navigation, taxonomy, and discovery behavior based on current architecture.

## Architecture Findings

### Blog Listing
- Route: `src/pages/blog/index.astro`
- Data source: `getCollection('blog')` filtered to `status === 'approved'`
- Sort order: descending by `date`
- Rendering model:
  - Featured approved post
  - Additional approved posts grid

### Blog Detail
- Route: `src/pages/blog/[slug].astro`
- Path generation: `getStaticPaths()` from approved posts only
- Detail metadata shown:
  - publish date (`date`)
  - author
  - category
  - tags
- Related articles: same-category approved posts (up to 3)

### Home Discovery Surface
- Route: `src/pages/index.astro`
- Component: `src/components/home/BlogPreview.astro`
- Behavior: shows latest 3 approved articles with date, category, title, summary, author.

## Category and Tag Support
Current support is active and schema-compatible:
- Category is stored and displayed in listing, detail, and home preview.
- Tags are stored and displayed in listing and detail.
- Related-post logic uses category matching.

## Draft/Private Protection
Current protection is active:
- Public listing and routes are generated from approved status only.
- Draft files in collection are excluded from listing and static paths.

## Image Support
- No article-level image field in active schema.
- Current blog pages do not render article hero/featured images.
- This is a known governance-template mismatch but not a runtime error.

## Schema/Template Mismatch Summary
Active schema in `src/content.config.ts` requires 9 fields.
Governance template in `docs/content/ARTICLE-TEMPLATE.md` defines 16 fields.
Missing in active runtime schema:
- createdDate
- publishDate
- lastModified
- knowledgeDomain
- description (active schema uses summary)
- seoTitle
- seoDescription
- featured
- featuredImage
- draft
- reviewStatus

## CONTENT-004 Readiness Decision
- Discovery basics are operational for current architecture.
- No minimal safe code change is required to expose currently supported metadata:
  - category: already exposed
  - tags: already exposed
  - publish date: already exposed via `date`
  - slug routing: already operational
  - draft exclusion: already enforced

## Optional Low-Risk Enhancements (Future, Not Applied Here)
1. Add a dedicated category badge style token for clearer taxonomy scanning.
2. Add tags to home preview cards if needed for consistency.
3. Add internal governance notes in authoring docs for taxonomy consistency checks.

## Validation Note
No site code changes were required by this readiness pass.
