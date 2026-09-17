# Public Naming Rule — Safety Assurance Global

Status: OWNER APPROVED

Effective: September 17, 2026

The public website uses **Safety Assurance Global** as the normal company name. The abbreviation `SAG` is not used as general public shorthand for the company.

This rule applies to rendered page copy, headings, calls to action, bylines, metadata, Government content, Institute content, capability materials, and downloadable public documents.

Technical filenames, repository paths, record IDs, code identifiers, and other non-public implementation details may retain legacy shorthand where changing them would create technical risk or break provenance.

Formally approved product names may retain their actual names when they are product identities rather than shorthand references to the company. Current protected names include `SAG Command`, `SAG Academy`, and `SAG SECURE`.

The production build validates rendered public text, accessibility-facing labels, and page metadata after static generation. The validator is a guardrail only: it fails the build when ordinary public company shorthand remains and does not rewrite generated HTML, URLs, scripts, styles, structured data, or product names.
