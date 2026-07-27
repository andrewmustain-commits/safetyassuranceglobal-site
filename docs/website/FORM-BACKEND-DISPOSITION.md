# FORM-BACKEND-DISPOSITION

Date: 2026-07-26
Repository: andrewmustain-commits/safetyassuranceglobal-site
Branch: website/public-site-full-refresh

## Objective

Establish a truthful, controlled intake pathway for `/contact` and `/request-proposal` that does not claim successful submission when backend delivery is unavailable.

## Decision Summary

- Decision: Implement a Cloudflare Pages Function endpoint at `/api/inquiry`.
- Submission model: Browser posts JSON payload to same-origin endpoint.
- Delivery model: Endpoint validates and forwards approved payload to an external webhook destination.
- Truthfulness control: Endpoint returns explicit 5xx status and user-facing failure text when backend integration is not configured.

## Implemented Components

- Client script: `public/scripts/intake-form.js`
- Contact form component: `src/components/forms/ContactInquiryForm.astro`
- Proposal form component: `src/components/forms/ProposalRequestForm.astro`
- Backend endpoint: `functions/api/inquiry.ts`

## Validation and Safety Controls

- Required-field validation on client and server.
- Email format validation on server.
- Honeypot field (`website`) checked on client and server.
- Payload size guard via `FORM_MAX_BODY_BYTES` (default 16384 bytes).
- Privacy acknowledgement required (`privacyAcknowledgement === true`).
- Conservative error responses for malformed payloads and upstream failures.

## Spam Control Posture

- Current baseline: honeypot + schema checks + size limits.
- Optional hardening: Turnstile verification when `TURNSTILE_SECRET_KEY` is configured.
- Current limitation: Turnstile widget token collection is not implemented in this phase; if Turnstile is enforced by secret configuration, requests will fail until token plumbing is added.

## Environment Variables

- `FORM_WEBHOOK_URL` (required for successful delivery)
- `FORM_WEBHOOK_AUTH_TOKEN` (optional bearer token)
- `FORM_MAX_BODY_BYTES` (optional override)
- `TURNSTILE_SECRET_KEY` (optional; enforces token verification)

## Failure-Mode Truthfulness

- If `FORM_WEBHOOK_URL` is unset: endpoint returns `503` with a truthful message instructing email fallback.
- If webhook delivery fails: endpoint returns `502` and client shows failure state.
- Client never presents a success message unless endpoint confirms `{ ok: true }`.

## Operational Runbook

1. Configure `FORM_WEBHOOK_URL` in target environment.
2. Optionally configure `FORM_WEBHOOK_AUTH_TOKEN`.
3. Test both forms for success and failure paths in preview.
4. Confirm webhook logs include expected fields and timestamps.
5. If enabling Turnstile, add front-end widget + token field (`turnstileToken`) before setting `TURNSTILE_SECRET_KEY`.

## Residual Risks

- No signed request scheme for webhook transport beyond optional bearer token.
- No rate limiting in this code path; depends on Cloudflare/WAF controls.
- No persisted queue/retry behavior for upstream webhook outages.

## Recommendation

Maintain current truthful failure behavior until production webhook configuration and optional anti-automation controls are fully validated.
