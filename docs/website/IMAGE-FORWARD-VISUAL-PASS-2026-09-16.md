# Image-Forward Visual Pass — 2026-09-16

Status: OWNER APPROVED FOR PUBLIC-SITE IMPLEMENTATION

## Direction

The approved public-site target is the more image-forward presentation reviewed by the owner on mobile on 2026-09-16. This pass keeps the existing verified production copy, navigation, inquiry/proposal behavior, policy routes, Institute governance boundaries, and public-claims controls while making photography a primary part of the page hierarchy.

## Visual implementation

- Larger and more visible photography in page heroes.
- Photography integrated into service, industry, capability, insight, government, Institute, About, Contact, and Home cards.
- Stronger navy/gold editorial treatment consistent with the approved mockups.
- Live HTML text remains separate from photography; no generated screenshot text is used as production content.
- Existing `public/images/site-2026/*` production photography is reused so the change does not introduce unreviewed project, client, agency, credential, or contact claims.
- Mobile remains a first-class layout: image cards collapse to one column and hero overlays preserve text readability.

## Claims and authority boundaries

This visual pass does not change factual claims or authority state. Photography remains representational and must not be interpreted as evidence of a specific SAG client, project, vessel, government agency, employee, endorsement, award, accreditation, credential decision, or open-enrollment status.

## Deployment gate

Merge only after the repository's standard build, audit, UX, route, metadata, sitemap, Turnstile, brand-asset, and CodeQL checks pass. Production cutover continues through the existing Cloudflare Pages workflow.
