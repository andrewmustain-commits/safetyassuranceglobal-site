# Cloudflare production deployment

## Architecture decision

This repository is an Astro static site with one Cloudflare Pages Function at `/api/inquiry`. It is not a Next.js application. `@opennextjs/cloudflare` is therefore intentionally not installed: that adapter transforms Next.js server output for Cloudflare Workers and would add an unrelated runtime and caching layer without improving this site.

Cloudflare Pages remains the deployment target. `wrangler.jsonc` is the version-controlled source of truth for the Pages project name, output directory, compatibility settings, and non-secret variables. Pages rejects the Workers-only `secrets` declaration, so encrypted secret names and values remain managed in Cloudflare Pages Variables and Secrets. The explicit `nodejs_compat` flag preserves the requested runtime contract; with the current compatibility date Cloudflare also enables the current Node.js compatibility behavior by default.

## Environments and bindings

Production is the top-level Wrangler environment. Preview deployments override `ENVIRONMENT` to `preview`. Both use the same conservative 16 KiB request limit.

Required encrypted secrets in both production and preview:

- `FORM_WEBHOOK_URL` — HTTPS intake-delivery endpoint.
- `TURNSTILE_SITE_KEY` — Turnstile widget site key. Although public in the browser, it is managed with the paired deployment secret contract.
- `TURNSTILE_SECRET_KEY` — Turnstile server-verification secret.

Optional encrypted secret:

- `FORM_WEBHOOK_AUTH_TOKEN` — bearer token sent to the intake webhook when the receiving service requires it.

No KV, D1, R2, Durable Object, service, or queue binding is currently required. Add one only when an approved application capability needs durable platform state. Real values and required secret names belong in encrypted Cloudflare Pages Variables and Secrets; `.dev.vars.example` documents local names without containing credentials.

## CI/CD

Pull requests and pushes run the existing content-governance, security, type, build, metadata, route, and UX checks plus the Cloudflare configuration check and Pages Function compilation. A push to `main` deploys `dist` and `functions` through the pinned Wrangler GitHub Action, then verifies production routes, redirects, headers, the 404 response, and the inquiry runtime.

GitHub environment `production` must contain:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`, scoped to the target account with Cloudflare Pages edit permission

Cloudflare production and preview Variables and Secrets must contain the bindings listed above before the corresponding deployment.

## Domain and DNS activation

The Pages project name is `safetyassuranceglobal`. In Cloudflare, open **Workers & Pages → safetyassuranceglobal → Custom domains** and add `safetyassuranceglobal.com`. Add `www.safetyassuranceglobal.com` if it should be accepted, then configure one canonical redirect to the apex domain. When the zone is hosted by Cloudflare, the Pages custom-domain flow creates the required proxied DNS record and certificate. Do not create a standalone CNAME to `*.pages.dev` without first associating the hostname with the Pages project.

Keep the existing registrar nameservers unchanged unless the domain is not yet using the intended Cloudflare zone. DNS and certificate activation are manual account-level changes and must be verified before treating the custom domain as connected.

## Caching and security defaults

Cloudflare Pages serves uploaded static assets through its cache. Fingerprinted Astro assets use one-year immutable browser caching; brand images use a seven-day browser cache with stale-while-revalidate. API responses are `no-store`. Static responses retain the approved CSP, HSTS, anti-framing, MIME-sniffing, referrer, permissions, opener, and cross-domain-policy headers. Pages preview and branch hostnames carry `X-Robots-Tag: noindex` to prevent duplicate indexing.

Account-level defaults to verify manually:

- SSL/TLS mode **Full (strict)**, Always Use HTTPS, and Automatic HTTPS Rewrites.
- Minimum TLS 1.2 or stronger.
- Managed WAF rules enabled where the account plan supports them.
- A rate-limiting rule for `POST /api/inquiry`; start conservatively and tune from observed legitimate traffic.
- Turnstile hostname allowlist includes the production domain and any intentionally tested preview hostname.
- Preserve the repository CSP as the authoritative browser policy unless a reviewed Cloudflare response-header rule is required.

## Release verification

Before merging, run `npm ci`, `npm run validate:cloudflare`, the existing validation suite, `npm run build`, and `npm run cloudflare:build-functions`. After the `main` deployment, require the production smoke workflow to pass. A deployment is incomplete if delivery or Turnstile reports unconfigured, even though the API exposes a safe email fallback.
