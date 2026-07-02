# Content Migration Plan (CONTENT-003)

Report date: 2026-07-02
Scope: Migration readiness for governed blog content using repository truth only.

## Objective
Prepare a safe, repeatable process to migrate approved articles from staging into the Astro blog collection without publishing drafts or inventing content.

## Source of Truth
- Inventory baseline: `docs/content/CONTENT-INVENTORY-REPORT.md`
- Template baseline: `docs/content/ARTICLE-TEMPLATE.md`
- Metadata baseline: `docs/content/METADATA-STANDARD.md`
- Review controls: `docs/content/REVIEW-CHECKLIST.md`
- Vocabulary controls: `docs/content/CONTROLLED-VOCABULARY.md`

## Current State Snapshot
- Approved in render path (`src/content/blog/`):
  - `assurance-framework-performance.md`
  - `public-site-launch.md`
- Draft in render path (`src/content/blog/`):
  - `pilot-checklist-draft.md`
- Approved in staging (`content/blog/`):
  - `approved-launch-update.md` (source already converted into `public-site-launch.md`)
- Draft in staging (`content/blog/`):
  - `draft-internal-roadmap.md`

## Migration Scope Rules
- Only migrate articles with explicit approved status in source.
- Never migrate draft/private content into approved published state.
- Do not fabricate missing business-roadmap articles.
- Do not alter deployment, secrets, CI/CD, or environment settings.

## Candidate Acceptance Criteria
A candidate is eligible for conversion when all conditions are met:
1. Source file exists in repository (`content/blog/` or other explicitly approved source path).
2. Source front matter status is `approved`.
3. Filename and slug can conform to controlled naming conventions.
4. Converted front matter satisfies active Astro schema in `src/content.config.ts`.
5. Content passes review gates in `docs/content/REVIEW-CHECKLIST.md` (applicable sections).
6. Local links and local assets resolve in build context.

## Batch Strategy Recommendation
- Recommended batch size: 1 to 5 approved articles per batch.
- Rationale:
  - Limits blast radius for schema or rendering issues.
  - Makes rollback simple.
  - Supports checkpoint builds and review traceability.

## Validation Gates Per Batch
1. Front matter lint/visual review against schema and vocabulary.
2. Build validation: `npm run build`.
3. Spot-check generated routes for only approved content.
4. Re-run inventory update to keep migration trace current.

## Stop Conditions
Stop migration immediately if any of the following occur:
- `npm run build` fails.
- Converted content violates schema in `src/content.config.ts`.
- Draft content appears in public listing/routes.
- Broken internal links or missing local assets are detected.
- Required review evidence is missing.

## Rollback Approach (No Deploy Impact)
- If failure happens before commit:
  - Remove or revert newly added/edited migration files in working tree.
  - Re-run `npm run build` to confirm restoration.
- If failure happens after commit (future process):
  - Revert the specific migration commit.
  - Re-run build and verify route set.

## Validation Commands
Use these commands during migration batches:

```bash
# Check working tree scope
git status --short

# Validate static generation and schema usage
npm run build

# Optional: inspect changed files only
git diff --stat
```

## Governance Notes
- This plan is readiness documentation only and does not publish content.
- Any future schema expansion to align with 16-field governance template is out of current migration scope and must be planned separately.
