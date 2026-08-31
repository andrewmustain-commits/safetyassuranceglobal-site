# Cloudflare production operations

The inquiry-delivery activation path is intentionally gated.

- `inquiry-activation.request` is a dormant request marker.
- `.github/workflows/cloudflare-inquiry-activate.yml` runs only when a push to `main` changes the request marker **and** the commit message contains `[activate-inquiry-delivery]`.
- The workflow checks Workers Scripts access before any Cloudflare write.
- If that permission check fails, the workflow exits before deploying the Worker or changing Pages bindings.
- After Worker deployment and Service Binding configuration, the workflow redeploys Pages and requires the hosted `/api/inquiry` runtime to report both `delivery.configured=true` and `turnstile.enabled=true`.

Live Contact and Proposal submissions remain separate production acceptance evidence because production Turnstile requires a real browser-issued token.
