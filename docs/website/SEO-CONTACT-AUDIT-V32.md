# Public Website v32 — SEO and Contact Discovery

## Scope

This release is intentionally narrow. It strengthens search identity and public contact discovery without redesigning the production site or changing the v31 inquiry-delivery architecture.

## Changes

- Replaces the generic homepage browser/search title with `Independent Assurance & Maritime Operational Readiness | Safety Assurance Global`.
- Preserves existing page-specific titles on non-home routes.
- Adds the four approved SAG public mailboxes to Organization JSON-LD as typed contact points.
- Adds a global footer Contact group so buyers can reach the correct mailbox from any public page.
- Extends structured-data validation so approved contact routing cannot silently regress.

## Approved mailbox routing

- `info@safetyassuranceglobal.com` — primary general inquiries and proposal fallback.
- `contact@safetyassuranceglobal.com` — secondary general contact.
- `academy@safetyassuranceglobal.com` — Institute and Academy inquiries.
- `command@safetyassuranceglobal.com` — SAG Command inquiries.

## Preserved controls

- v31 secure webhook-first inquiry architecture remains unchanged.
- v31 prefilled email fallback remains unchanged.
- Existing UEI, CAGE, NAICS, business-base, Institute relationship, breadcrumb, and WebSite publisher validation remains enforced.
- No unsupported accreditation, contract-award, licensing, or regulatory claims are introduced.

## Release gate

Merge only after the exact PR head passes Build Validation, PR Build Validation, and both required CodeQL analyses. After merge, verify the exact merge SHA through the Cloudflare production deployment and hosted-route smoke test.
