# MARBLISM-PENNY-INTEGRATION

Date: 2026-07-26
Repository: andrewmustain-commits/safetyassuranceglobal-site
Branch: website/public-site-full-refresh

## Verified Integration Capability

Verified in-repo capability today: Markdown export/import workflow.

- No documented Marblism/Penny direct publish API contract is present in this repository.
- No verified GitHub App contract or service-side webhook contract for automatic branch/PR creation is present.
- Therefore, the selected and implemented method is a governed Markdown import workflow.

## Selected Workflow

Selected option: D. Manual governed import workflow (per priority order fallback).

Flow:

Marblism or Penny export
-> content intake (quarantine)
-> governed importer
-> validation gates
-> feature branch commit
-> pull request review
-> human approval
-> merge
-> Cloudflare static build
-> published article

## Trust Boundaries

- Intake boundary: `content/intake/` (unpublished source content).
- Publication boundary: `src/content/blog/` (Astro content collection under governance checks).
- Runtime boundary: static build output only; no runtime content mutation.

## Publication States

Implemented statuses:

- draft
- internal-review
- claims-review
- legal-review
- executive-review
- approved
- published
- archived

Public routes include only `published`.

## Intake Format

Input supports markdown with frontmatter fields (minimum):

- title
- description (or summary for fallback)
- author
- category
- tags
- source
- slug (optional; normalized if absent)
- status (must not be published)

## Schema and Governance

Astro content schema enforces governed fields in `src/content.config.ts`.

Validation commands:

- `npm run blog:status`
- `npm run blog:claims`
- `npm run blog:validate`
- `npm run validate:links`

## Claims-Review Process

Claims-sensitive topics are detected by keyword policy in validation tooling.

Publication is blocked when:

- claims-sensitive article lacks `claimsReview.required: true`
- published claim-sensitive article lacks approved disposition
- published claim-sensitive article lacks reviewer/reviewedAt

## Branch and PR Workflow

- Import and edits are committed on feature branches.
- Publication requires PR review and approval.
- No direct publish path from Marblism/Penny to Cloudflare runtime exists.

## Environment Variables and Tokens

- No Marblism/Penny API token usage is implemented in this phase.
- No GitHub token is exposed in browser code.
- Existing form backend secrets remain server-side only in Cloudflare environment variables.

## Failure Handling

Importer fails safely with no partial publication when:

- frontmatter is malformed
- slug collides with existing content
- status is `published` in intake
- required metadata is missing
- image metadata is invalid

## Rollback

Rollback path is Git-based:

- revert publication commit
- restore prior status in frontmatter
- redeploy static site via standard branch flow

## Sample Article Workflow

Demonstrated in this phase:

1. Intake markdown created in `content/intake/penny-operational-readiness-before-mobilization.md`
2. Imported via `npm run blog:import -- content/intake/penny-operational-readiness-before-mobilization.md`
3. Import report generated under `docs/website/reports/`
4. Draft reviewed and promoted to `published` after governance metadata completion

## Cloudflare Behavior

Cloudflare publishes only build artifacts from repository state after merge.
No runtime mutation of deployed files is implemented.

## Unsupported Assumptions

The following are not assumed and not implemented:

- direct Marblism/Penny API publishing to production
- automatic publish from webhook without PR approval
- browser-side secrets for content publication
- direct mutation of deployed static files
