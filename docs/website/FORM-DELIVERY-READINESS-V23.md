# Public Website v23 — Form Delivery Readiness

This release strengthens buyer-facing inquiry reliability without exposing secrets or changing the external webhook contract.

## Runtime behavior
- `/api/inquiry` GET reports whether a secure HTTPS form-delivery webhook is configured.
- The runtime response exposes only a boolean delivery state; it does not expose the webhook URL or authorization token.
- Contact and proposal forms disable submission before buyer entry when delivery is unavailable.
- The UI gives the existing public fallback email address when delivery is unavailable.
- Server-side POST behavior remains fail-closed when webhook delivery is missing or upstream delivery fails.

## Security / claims boundary
- No secret values are returned to the browser.
- Turnstile behavior remains unchanged and fail-closed on mismatched keys.
- Form field names and the outbound webhook payload schema remain unchanged.
- No public capability or certification claim is added by this release.
