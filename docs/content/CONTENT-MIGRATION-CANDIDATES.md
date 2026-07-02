# Content Migration Candidates (CONTENT-003)

Report date: 2026-07-02
Scope: Candidate list derived from repository truth only.

## Decision Table

| Filename | Current Location | Source Status | Candidate Outcome | Reason |
|---|---|---|---|---|
| assurance-framework-performance.md | src/content/blog/ | approved | Excluded (already converted) | Already in active Astro collection |
| public-site-launch.md | src/content/blog/ | approved | Excluded (already converted) | Already in active Astro collection |
| pilot-checklist-draft.md | src/content/blog/ | draft | Excluded (draft) | Draft must not be treated as approved |
| approved-launch-update.md | content/blog/ | approved | Excluded (superseded source) | Already converted to `public-site-launch.md` |
| draft-internal-roadmap.md | content/blog/ | draft | Excluded (draft) | Draft must remain private |

## Candidate Summary
- Net approved candidates pending conversion: 0
- Net draft candidates: 2 (both excluded from approved migration)
- Net already converted approved articles: 2

## Acceptance Criteria (For Future Candidates)
Future approved candidates are accepted only when:
1. Status is explicitly `approved` in source front matter.
2. Source content exists in repository and is not inferred.
3. Converted output includes all required schema fields from `src/content.config.ts`.
4. Category/tag values align with controlled terms and naming conventions.
5. Build passes with no schema/render failures.
6. Checklist sections in `docs/content/REVIEW-CHECKLIST.md` are completed as applicable.

## Future Intake Workflow
1. Add approved source article to staging area.
2. Convert into `src/content/blog/` using active schema.
3. Validate with `npm run build`.
4. Update `docs/content/CONTENT-INVENTORY-REPORT.md` and this candidate register.

## Reference Baselines
- `docs/content/CONTENT-INVENTORY-REPORT.md`
- `docs/content/ARTICLE-TEMPLATE.md`
- `docs/content/REVIEW-CHECKLIST.md`
