# Content Migration Runbook (CONTENT-003)

Report date: 2026-07-02
Purpose: Safe step-by-step runbook for future approved article migrations.

## Preconditions
- You have one or more source articles with status `approved` in repository truth.
- You are not changing deployment pipelines or environment secrets.
- Working tree is understood before migration starts.

## Procedure

### Step 1: Baseline Check
```bash
git status --short
```
Confirm current working-tree scope before edits.

### Step 2: Verify Candidate Eligibility
For each source article:
- Confirm source file exists.
- Confirm source status is `approved`.
- Confirm it has not already been converted.
- Confirm filename/slug compatibility with naming rules.

### Step 3: Convert to Active Astro Schema
Create/update target article in `src/content/blog/` with required fields from `src/content.config.ts`:
- title
- date
- author
- category
- tags
- summary
- status
- source
- slug

### Step 4: Governance Gate Checks
Apply relevant sections of:
- `docs/content/REVIEW-CHECKLIST.md`

Minimum checks before build:
- Metadata valid and complete for active schema.
- Internal links resolve.
- Local image references resolve (if used).
- Markdown syntax and headings are valid.

### Step 5: Build Validation
```bash
npm run build
```
Required outcome: success.

### Step 6: Post-Build Verification
- Confirm generated routes include only approved content.
- Confirm no draft article is listed publicly.
- Confirm changed file scope is only intended migration files.

```bash
git status --short
git diff --stat
```

### Step 7: Update Tracking Docs
Update:
- `docs/content/CONTENT-INVENTORY-REPORT.md`
- `docs/content/CONTENT-MIGRATION-CANDIDATES.md`

## Recommended Batch Size
- 1 to 5 approved articles per batch.
- Run build after each batch.

## Stop Conditions
Stop immediately if:
- Build fails.
- Schema mismatch appears.
- Draft content appears in public routes/listing.
- Broken links/assets detected.
- Checklist-required evidence is incomplete.

## Rollback Procedure
If a stop condition occurs before commit:
1. Revert or remove newly changed migration files from the working tree.
2. Re-run build.
3. Confirm tree and routes are restored.

If stop condition occurs after commit (future use):
1. Revert the migration commit.
2. Re-run build.
3. Confirm route and metadata restoration.

## Command Set
```bash
# Build validation
npm run build

# Scope inspection
git status --short
git diff --stat
```

## Notes
- This runbook enforces repository truth only.
- No fake or placeholder articles are permitted.
