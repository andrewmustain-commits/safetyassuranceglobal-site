# Public Website v29 — Semantic Accessibility and Asset Integrity

**Production merge:** `2aa724545a39987ad815b2752beadd4a5c8f268a`  
**Cloudflare production run:** `33286386542`  
**Status:** Deployed and verified

## Summary

Public Website v29 strengthened the generated-site QA gate without changing buyer-facing claims, navigation, form field contracts, Turnstile behavior, or the Cloudflare Pages architecture.

## Added validation

The `validate:public-ux` gate now checks all generated HTML pages for:

- exactly one `<main>` landmark;
- exactly one `<h1>`;
- a working skip-navigation link whose target exists;
- accessible button naming;
- accessible labels for form controls;
- image `alt` attributes;
- duplicate element IDs;
- dead or placeholder anchor targets;
- safe `rel="noopener noreferrer"` behavior for `target="_blank"` links;
- referenced local images, scripts, stylesheets, icons, and fonts that exist and are non-empty.

## Security hardening

The asset-integrity checker resolves local asset paths against `dist/`, rejects any resolved path outside the generated-site root, and stats each asset once with error handling. This closes a path-traversal weakness identified during pull-request review.

The validator also removed a generic HTML-tag stripping pattern after CodeQL flagged it as an unsafe sanitization construct. The replacement checks accessibility without treating a regex as an HTML sanitizer.

## CI/CD verification

Exact-head PR Build Validation, Build Validation, CodeQL JavaScript/TypeScript, and CodeQL Actions all passed before merge. The production workflow then passed dependency audit, governance checks, brand validation, Turnstile integration validation, Astro diagnostics, build, link validation, structured-data validation, head-metadata validation, publication-route validation, sitemap validation, public UX validation, Cloudflare Pages deployment, and hosted production-route verification.

## Governance follow-up

At v29 release, GitHub reported `main` as unprotected. v30 prepares unique required-check names and an admin-run `gh api` script so `main` can require PRs, required checks, conversation resolution, no force pushes/deletions, and admin enforcement without deadlocking a single-maintainer repository.
