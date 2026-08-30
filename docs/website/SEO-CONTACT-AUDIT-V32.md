# Public Website v32 — SEO and Contact Audit

Date: 2026-08-30
Baseline: `9e105a81161a6a2bf4ed29e6adff37057c3eaf60` (Public Website v31)

## Scope

This audit reviews the next buyer-facing refinement layer after v31 restored public inquiry lead capture and routed the approved SAG mailboxes.

## Findings

1. The homepage body copy and H1 already communicate the intended maritime-first assurance position. A broad content rewrite is not justified.
2. The homepage document title is currently `Home | Safety Assurance Global`, which is technically valid but less descriptive than the visible positioning. A descriptive SEO title should replace `Home` without changing the H1 or buyer-facing hero copy.
3. The Organization JSON-LD already carries legal name, UEI, CAGE, NAICS, Oregon business base, logo, website publisher relationship, and Institute department relationship. The approved public mailbox set is not yet represented as Organization contact points.
4. The public Contact page now exposes the four approved addresses and dedicated routes established in v31:
   - `info@safetyassuranceglobal.com` — primary general/proposal inquiry
   - `contact@safetyassuranceglobal.com` — secondary general contact
   - `academy@safetyassuranceglobal.com` — Institute/Academy/training
   - `command@safetyassuranceglobal.com` — SAG Command
5. Institute/Training and SAG Command now have dedicated email routing, so no further redirect or mailbox consolidation is needed.
6. Existing metadata, canonical, breadcrumb, structured-data, sitemap, public-UX, accessibility, and asset-integrity validators should remain authoritative. Any v32 metadata changes must extend—not bypass—those gates.

## Controlled v32 implementation target

- Change the homepage document/OG/Twitter title from generic `Home` to a concise descriptive title centered on maritime assurance and operational readiness.
- Add evidence-backed `ContactPoint` entries to the Organization JSON-LD for the approved mailboxes, using conservative contact types and no unsupported availability claims.
- Surface the general and dedicated contact channels in the global footer only if the layout remains readable on mobile.
- Extend structured-data validation to require the approved contact points so later edits cannot silently regress them.
- Do not change form field names, `/api/inquiry`, Turnstile behavior, webhook handling, or v31 email fallback logic.
- Do not introduce new corporate claims, certifications, awards, contract vehicles, or accreditation language.

## Conversion posture

The primary conversion path remains:

Home → Maritime / Services / Capabilities → Contact / Request Proposal → secure webhook when configured, otherwise validated prefilled email fallback to `info@safetyassuranceglobal.com`.

## Release rule

No v32 runtime change should merge unless exact-head PR Build Validation, Build Validation, both CodeQL analyses, review-thread resolution, Cloudflare publish, and hosted production-route verification are green.
