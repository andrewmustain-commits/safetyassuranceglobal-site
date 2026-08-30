# Public Website v29 — Semantic Accessibility and Asset Integrity

This release strengthens the existing generated-site public UX gate without changing buyer-facing claims or form/API contracts.

The validator now requires every generated HTML page to preserve:
- exactly one main landmark and one H1;
- a working skip link whose target exists;
- accessible names for buttons;
- associated labels or accessible naming for form controls;
- alt attributes on images;
- unique IDs;
- non-placeholder anchors;
- noopener and noreferrer protection for target=_blank links;
- non-empty local image, script, stylesheet, icon, and font assets referenced by generated HTML;
- no internal legal-review notes in public output.

The existing Astro build, link, structured-data, head-metadata, publication-route, sitemap, brand-asset, Turnstile, dependency-audit, and CodeQL controls remain unchanged.
