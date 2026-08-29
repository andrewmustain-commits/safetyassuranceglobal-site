# Public Website v21 — Official SAG Seal Asset

PR #45 promotes the exact uploaded `public/images/brand/image.png` as the production-visible Safety Assurance Global seal used by the centralized brand component.

The upload intake also contained temporary Copilot image filenames, an opaque JPG, and two Service-Disabled Veteran-Owned badge files. Those files were removed from the PR and are not approved for public production use in this change. Badge artwork must be separately verified before publication.

The production brand validator now checks the exact uploaded PNG for existence, minimum production size, and the PNG file signature. Existing SVG assets remain as supporting/fallback brand assets and the browser icon.

No form schema, Turnstile controls, public-claims controls, sitemap/publication gates, structured-data architecture, or Cloudflare deployment architecture are changed by this release.
