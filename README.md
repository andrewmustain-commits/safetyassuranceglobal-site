# Safety Assurance Global Public Website

Production public website for Safety Assurance Global LLC, built with Astro + TypeScript and deployed to Cloudflare Pages.

## Current production posture

- Production branch: `main`
- Production host: `https://safetyassuranceglobal.com`
- Static site generation: Astro
- Cloudflare Pages deployment: active
- Pages Functions: active for governed inquiry runtime
- Cloudflare Turnstile: active on public inquiry flows
- Private inquiry delivery Worker: deployed and bound through `INQUIRY_DELIVERY`
- Positive-path server email delivery: **held pending Cloudflare Email Sending entitlement / final E2E receipt verification**
- Safe email-client fallback: active
- Institute authority remains separate and fail-closed

The current corporate-site operational posture is governed by:

- `docs/website/WEBSITE-DEFECT-REGISTER.md`
- `docs/website/FORM-BACKEND-DISPOSITION.md`
- `docs/operational-authority-release-gates.md`

Historical release/audit documents under `docs/website/` are retained as evidence and may describe superseded states.

## Tech stack

- Astro
- TypeScript
- Static Site Generation
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare Workers
- Cloudflare Turnstile
- GitHub Actions
- CodeQL

## Public architecture

Primary public routes include:

- `/`
- `/about`
- `/services` and governed service detail routes
- `/capabilities`
- `/industries` and governed industry detail routes
- `/maritime`
- `/government`
- `/method`
- `/insights`
- `/rss.xml`
- `/contact`
- `/request-proposal`
- `/institute` — corporate gateway only; Institute authority remains separate
- `/privacy-policy`
- `/terms-of-use`
- `/accessibility`

Legacy routes are controlled through `public/_redirects`.

Security and cache headers are controlled through `public/_headers`.

## Project structure

- `src/pages/` — public routes
- `src/components/` — shared UI and forms
- `src/content/blog/` — governed Insights content
- `src/content.config.ts` — governed content schema
- `src/config/` — controlled site configuration and brand assets
- `src/lib/` — shared content and route utilities
- `functions/api/inquiry.ts` — same-origin public inquiry API
- `workers/inquiry-delivery/` — private inquiry-delivery Worker
- `public/scripts/intake-form.js` — client-side governed form flow
- `scripts/` — build, claims, security, routing, metadata, sitemap, UX, and production verification controls
- `docs/content/` — content governance
- `docs/website/` — website evidence, audits, and current operational records
- `.github/workflows/` — CI, deployment, preflight, activation, CodeQL, and Lighthouse workflows

## Local development

Use the Node version supported by the repository engine requirement; production CI currently qualifies on Node 24.

```bash
npm ci
npm run dev
```

## Build and validation

```bash
npm run check
npm run build
npm run blog:validate
npm run validate:brand-assets
npm run validate:public-claims
npm run validate:turnstile
npm run validate:inquiry-delivery
npm run validate:inquiry-hardening
npm run validate:structured-data
npm run validate:head
npm run validate:publication-routes
npm run validate:sitemap
npm run validate:links
npm run validate:public-ux
```

Dependency audits are enforced in CI at moderate severity or higher.

## Governed Insights publishing

Public Insights publish only content whose governance state permits publication.

Required frontmatter includes:

- `title`
- `slug`
- `description`
- `author`
- `publishedAt`
- `status`
- `category`
- `tags`
- `featured`
- `source`
- `claimsReview`
- `legalReview`
- `executiveApproval`
- `redirectFrom`

Governance commands:

```bash
npm run blog:status
npm run blog:claims
npm run blog:validate
npm run blog:import -- <path>
```

## Inquiry architecture

The public Contact and Proposal forms follow a fail-closed path:

1. Browser loads runtime delivery status from `/api/inquiry`.
2. Required fields, privacy acknowledgement, honeypot, size limits, origin, content type, and schema are validated.
3. Turnstile is rendered when server delivery is configured.
4. Valid submissions are server-verified against Turnstile.
5. The Pages Function forwards accepted submissions to the private `INQUIRY_DELIVERY` Service Binding.
6. The bound `sag-inquiry-delivery` Worker attempts approved email delivery.
7. If server delivery fails, the browser opens a controlled prefilled email fallback rather than displaying false success.

Current limitation: the Worker and Service Binding are deployed and qualified, but Cloudflare Email Sending is not enabled on the account. Issue #58 remains the controlling acceptance record until one live Contact and one live Proposal submission are both delivered through the server path and independently confirmed.

## CI / production gates

Pull requests and production pushes are checked through the applicable workflows for:

- deterministic dependency installation
- dependency audit
- public claims governance
- brand integrity
- Turnstile integration
- inquiry delivery Worker validation
- inquiry hardening
- Astro diagnostics
- production build
- link integrity
- structured data
- head metadata
- publication routes
- sitemap integrity
- public UX
- CodeQL

Production deployment additionally runs hosted route verification and Lighthouse monitoring.

A green build does not authorize separately gated capabilities such as Institute authority, commerce, enrollment, credential issuance, certificate issuance, or public credential verification.
