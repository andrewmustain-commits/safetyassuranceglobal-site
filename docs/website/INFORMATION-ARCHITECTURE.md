# INFORMATION-ARCHITECTURE

Date: 2026-07-26
Phase: 1 of 5

## Existing Route Map (Current Build)

- `/404`
- `/`
- `/about`
- `/academy`
- `/blog`
- `/blog/measuring-assurance-framework-performance`
- `/blog/public-site-launch`
- `/command`
- `/contact`
- `/government`
- `/industries`
- `/insights`
- `/insights/measuring-assurance-framework-performance`
- `/insights/public-site-launch`
- `/maritime`
- `/maritime-training`
- `/method`
- `/privacy-policy`
- `/request-proposal`
- `/services`
- `/terms`
- `/terms-of-use`
- `/training`

Current route count: 23

## Proposed Final Primary Navigation

- Home
- Maritime
- Services
- Training
- Industries
- Government
- About
- Insights
- Contact

Primary CTA (global):
- Request a Consultation

## Approved Proposed Route Map

- `/`
- `/maritime`
- `/services`
- `/services/operational-readiness`
- `/services/independent-assurance`
- `/services/maritime-compliance`
- `/services/qa-qc`
- `/services/contractor-assurance`
- `/services/safety-risk-management`
- `/services/incident-investigation`
- `/services/embedded-hse-support`
- `/services/emergency-preparedness`
- `/services/program-assurance`
- `/training`
- `/maritime-training`
- `/industries`
- `/industries/shipyards`
- `/industries/ports-marine-terminals`
- `/industries/vessel-operators`
- `/industries/marine-contractors`
- `/industries/government`
- `/industries/critical-infrastructure`
- `/government`
- `/about`
- `/method`
- `/sag-command`
- `/insights`
- `/insights/[slug]`
- `/insights/category/[category]`
- `/insights/tag/[tag]`
- `/contact`
- `/request-proposal`
- `/privacy-policy`
- `/terms-of-use`
- `/404`
- `/rss.xml`

## Consolidation Guidance (No Thin Pages)

- Keep child service pages only where there is enough original, evidence-safe content to support clear user intent.
- If content is not ready, consolidate to parent pages with anchored sections until validated copy exists.
- Consolidate current `/academy` and `/training` narratives into one controlled training architecture unless independent validated content volume supports both.
- Convert `/blog` to `/insights` structure with taxonomy only if category/tag governance is implemented and maintained.

## Footer Structure (Recommended)

Footer group 1: Core
- Home
- Maritime
- Services
- Industries
- Government

Footer group 2: Capability
- Training
- Method
- Insights
- Contact

Footer group 3: Legal
- Privacy Policy
- Terms of Use

Footer utility
- Request a Consultation (primary)
- Request Proposal (secondary)

## Redirects Required

Minimum required redirects to preserve important legacy URLs:

- `/blog` -> `/insights`
- `/blog/:slug` -> `/insights/:slug`
- `/academy` -> `/training` (if consolidated)
- `/command` -> `/sag-command`
- `/terms` -> `/terms-of-use`

Conditional redirects (based on final copy scope):

- Legacy service anchors in `/services` to corresponding child routes once published.
- Legacy industry references to child industry routes once published.

## Pages to Consolidate

- `/academy` + `/training` (recommended single training information architecture unless both can be fully substantiated)
- `/blog` into `/insights` (with route migration and taxonomy)

## Pages to Remove

- `/terms` (replace with redirect to `/terms-of-use`)

## Pages to Hold

- `/command` content model pending executive decision on public SAG Command framing and substantiation level.
- High-risk insights article route pending claims-safe rewrite.

## Implementation Order

1. Baseline controls
- Add route governance matrix and claim-evidence gating in content workflow.
- Add redirects and headers baseline files before major route movement.

2. Positioning alignment
- Update global nav/footer and home/about/services/industries/contact copy for independent-assurance maritime positioning.

3. Route architecture rollout
- Build parent routes first: maritime, services, training, industries, government, insights.
- Add child routes only when non-thin, validated content is available.

4. Insights migration
- Move `/blog` to `/insights`; implement slug/category/tag routes and RSS.

5. Legal and utility hardening
- Consolidate terms routes, add custom 404, verify canonical and metadata consistency.

## Executive Decisions Required

1. Public treatment of SAG Command
- Confirm whether SAG Command remains a standalone route, becomes a method page, or remains gated.

2. Academy/training architecture
- Confirm consolidation of `/academy` into `/training` versus dual-route strategy with sufficient unique content.

3. Government claim threshold
- Define approval criteria and evidence package required before publishing government/federal-facing capability claims.

4. High-risk article disposition
- Confirm rewrite, archival, or removal path for `/blog/infrastructure-of-integrity-risk-governance`.

5. Service depth scope for Phase 2
- Confirm which child service routes are in-scope for immediate build and which remain parent-level sections temporarily.

## Cloudflare and Node Baseline (Documented)

Intended Cloudflare baseline:
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Astro static output: confirmed (`output: static`)
- Preview deployments: expected

Node baseline:
- Required: `22.12.0` (or verified compatible Node 22)
- Added file: `.node-version` with `22.12.0`

Out-of-scope in this phase:
- DNS changes
- Cloudflare secrets changes
- Custom domain changes
- Production environment changes
