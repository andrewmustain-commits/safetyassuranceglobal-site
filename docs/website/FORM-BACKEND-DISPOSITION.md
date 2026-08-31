# FORM-BACKEND-DISPOSITION

Date: 2026-08-31
Repository: andrewmustain-commits/safetyassuranceglobal-site
Status: Production architecture current; account-side delivery activation pending

## Objective

Provide a truthful, controlled intake pathway for `/contact` and `/request-proposal` that delivers through Cloudflare when configured and never claims successful submission when server-side delivery is unavailable.

## Current Architecture

- Browser submits JSON to the same-origin Cloudflare Pages Function at `/api/inquiry`.
- Turnstile runtime state is discovered through `GET /api/inquiry`.
- When both Turnstile keys are configured, the browser renders the official Turnstile widget and the Pages Function verifies the token server-side.
- Preferred delivery transport: private Pages Service Binding named `INQUIRY_DELIVERY` to the dedicated Worker `sag-inquiry-delivery`.
- The delivery Worker sends transactional intake email through Cloudflare Email Service using the restricted `EMAIL` binding.
- Secondary server-side transport: approved HTTPS `FORM_WEBHOOK_URL`, with optional bearer token.
- Final user-visible fallback: a validated, bounded, prefilled email handoff to `info@safetyassuranceglobal.com`, with `contact@safetyassuranceglobal.com` retained as a secondary mailbox.
- Success is shown only after a server-side transport returns a successful response.

## Implemented Components

- Client script: `public/scripts/intake-form.js`
- Contact form: `src/components/forms/ContactInquiryForm.astro`
- Proposal form: `src/components/forms/ProposalRequestForm.astro`
- Pages Function: `functions/api/inquiry.ts`
- Private delivery Worker: `workers/inquiry-delivery/src/index.ts`
- Worker configuration: `workers/inquiry-delivery/wrangler.jsonc`
- Integration validation: `scripts/validate-turnstile-integration.mjs`

## Delivery Ordering

1. Validate request method, same-origin posture, JSON content type, size, schema, required fields, privacy acknowledgement, honeypot, and business-email format.
2. If Turnstile is enabled, require and verify a valid token.
3. If `INQUIRY_DELIVERY` exists, call the private delivery Worker first.
4. If the private Worker fails and an approved HTTPS webhook is configured, attempt the webhook.
5. If every configured server-side transport fails, return a truthful `502` so the browser opens its prefilled email fallback.
6. If no server-side transport is configured, return a truthful `503` and use the same email fallback.

## Cloudflare Email Service Controls

The delivery Worker is intentionally non-public:

- `workers_dev: false`
- `preview_urls: false`

The `send_email` binding is restricted to:

- Destination: `info@safetyassuranceglobal.com`
- Allowed sender: `website@safetyassuranceglobal.com`

The Worker validates the form type and reply-to email, sanitizes header-valued fields to prevent CR/LF injection, bounds values, and sends only normalized intake content.

## Turnstile Posture

Turnstile plumbing is fully implemented.

- Public site key: `TURNSTILE_SITE_KEY`
- Private secret: `TURNSTILE_SECRET_KEY`
- The endpoint fails closed if only one key is configured.
- Missing tokens are rejected when Turnstile is enabled.
- Invalid tokens are rejected server-side.
- The secret key is never exposed to the browser.

## Runtime Configuration

Pages production bindings / variables:

- `INQUIRY_DELIVERY` — preferred Service Binding to Worker `sag-inquiry-delivery`
- `TURNSTILE_SITE_KEY` — production Turnstile site key
- `TURNSTILE_SECRET_KEY` — production Turnstile secret
- `FORM_WEBHOOK_URL` — optional approved HTTPS backup delivery endpoint
- `FORM_WEBHOOK_AUTH_TOKEN` — optional backup webhook bearer token
- `FORM_MAX_BODY_BYTES` — optional override; default 16384 bytes

Worker binding:

- `EMAIL` — Cloudflare Email Service `send_email` binding restricted in `workers/inquiry-delivery/wrangler.jsonc`

No account IDs, API tokens, Turnstile secrets, webhook tokens, or other production secrets belong in source control.

## Production Activation Runbook

1. Confirm Cloudflare Email Service is available for the account and the approved sender/destination requirements are satisfied.
2. Deploy `sag-inquiry-delivery` using `workers/inquiry-delivery/wrangler.jsonc`.
3. In the `safetyassuranceglobal` Pages production environment, add Service Binding `INQUIRY_DELIVERY` targeting `sag-inquiry-delivery`.
4. Configure the production Turnstile widget for the SAG public domain and set `TURNSTILE_SITE_KEY` plus `TURNSTILE_SECRET_KEY` in the Pages production environment.
5. Keep the webhook variables unset unless an independently approved backup webhook is intentionally retained.
6. Confirm live `GET /api/inquiry` reports `delivery.configured: true` and `turnstile.enabled: true`.
7. Submit one controlled Contact inquiry and independently confirm receipt at the approved destination.
8. Submit one controlled Proposal request and independently confirm receipt.
9. Confirm missing and invalid Turnstile tokens are rejected.
10. Confirm a delivery failure does not produce a false success and still opens the prefilled email fallback.
11. Re-run production route verification and Lighthouse after activation.

## Failure-Mode Truthfulness

- No configured delivery transport: `503`, browser email fallback.
- Private Worker fails, backup webhook succeeds: success may be shown because a server-side transport confirmed delivery.
- All configured delivery transports fail: `502`, browser email fallback.
- Missing/invalid Turnstile token when enabled: request rejected; no delivery attempted.
- Client never presents success unless `/api/inquiry` returns `{ ok: true }`.

## Residual Risks

- Cloudflare Email Service and production Service Binding activation are account-side prerequisites and must be verified before Issue #58 can close.
- No persisted queue/retry mechanism exists for a temporary Email Service outage; the controlled fallback remains the user's email client.
- Rate limiting remains primarily a Cloudflare WAF/platform control in addition to Turnstile and application validation.

## Release Decision

Keep Issue #58 open until the private delivery binding is active in production and both Contact and Proposal flows are independently proven end-to-end. The source implementation is designed to preserve the existing safe fallback until that operational activation occurs.
