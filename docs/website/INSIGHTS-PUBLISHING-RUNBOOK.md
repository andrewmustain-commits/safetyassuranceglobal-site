# INSIGHTS-PUBLISHING-RUNBOOK

Date: 2026-07-26
Repository: andrewmustain-commits/safetyassuranceglobal-site
Branch: website/public-site-full-refresh

## Create Article (Manual Authoring)

1. Add markdown file in `src/content/blog/` with governed frontmatter schema.
2. Set initial status to a non-public state (`draft` recommended).
3. Run governance validators.

## Import Article (Marblism/Penny)

1. Place exported markdown in `content/intake/`.
2. Run `npm run blog:import -- <path>`.
3. Confirm import report in `docs/website/reports/`.
4. Review generated frontmatter and body quality.

## Validate Article

Run in order:

1. `npm run blog:status`
2. `npm run blog:claims`
3. `npm run blog:validate`
4. `npm run check`
5. `npm run build`
6. `npm run validate:links`

## Review Claims

1. Determine whether claim-sensitive keywords/topics apply.
2. If required, set `claimsReview.required: true`.
3. Complete reviewer, reviewedAt, and disposition before publication.

## Review Legal Content

1. Mark `legalReview.required` where legal sensitivity exists.
2. Record legal reviewer/disposition for publishable content.

## Approve Article

1. Complete `executiveApproval` block as required.
2. Ensure all mandatory review blocks are complete and valid.

## Publish Article

1. Change status to `published` only after reviews complete.
2. Confirm canonical URL and redirect metadata.
3. Merge approved PR.

## Update Article

1. Edit content and set `updatedAt`.
2. Re-run governance and build checks.
3. Merge through PR review.

## Archive Article

1. Change status to `archived`.
2. Add redirect strategy when needed.
3. Merge and validate route behavior.

## Redirect Article

1. Add prior paths to `redirectFrom` metadata.
2. Add edge redirect rules when route-level migration is required.
3. Validate final link matrix.

## Rollback Publication

1. Revert publication commit or restore non-public status.
2. Rebuild and deploy via standard branch workflow.

## Emergency Unpublish

1. Immediately set status to non-public state (`draft` or `claims-review`).
2. Commit to hotfix branch and open urgent PR.
3. Merge and verify route removal and RSS exclusion.
4. Log disposition in website governance documentation.
