# September 17 Website Review — Implementation Notes

This record binds the owner-approved `Safety Assurance Global Complete Website Review — September 17, 2026` into the website improvement program.

## Accepted as controlling direction

- Buyer-first language must precede internal assurance terminology.
- Core services must be presented as concrete, purchasable work with defined inputs, work performed, delivery model, outputs, decision value, and limitations where verified.
- Government and major-prime pathways must make qualification easier rather than requiring buyers to reconstruct Safety Assurance Global's capabilities.
- Public credibility should come increasingly from verified people, qualifications, attributed experience, and sample deliverables.
- Internal governance and system architecture should not dominate customer-facing pages.
- Training pages should distinguish real availability, custom development, and pilots.
- Public credibility and controlled qualification records must remain separate.
- Verified correction remains the core commercial differentiator.

## Implemented in this release candidate

- Replaced the generated-HTML naming rewrite with a validation-only build guardrail. Ordinary public company shorthand now fails the build; approved formal product names remain protected.
- Updated active public copy to use `Safety Assurance Global`, including Home, Services, Maritime, Industries, Government, Capabilities, About, Institute, Contact, proposal routes, service/industry detail routes, and public Insights bylines.
- Reframed Government around defined agency/public-owner and prime-contractor buying paths, published procurement identifiers, scoped work examples, expected outputs, and a controlled supplier-qualification request path.
- Added a dated downloadable public capability statement using already-published corporate identifiers, contacts, capability descriptions, and clearly attributed individual prior-employer experience.
- Reworked About around the assignment lifecycle, named leadership roles already published on the site, verified-correction delivery, and a concise explanation of Safety Assurance Global, the Institute of Assurance, and the `Powered by Mandavere` brand attribution.
- Reworked the Institute and Training pages toward buyer questions, delivery models, program-status definitions, and offering-specific availability/credential boundaries.
- Added concise buyer service sheets generated from the existing service registry.
- Added sanitized illustrative sample-deliverable structures for readiness assessments, findings/actions/closure, inspections, corrective-action validation, and management reporting. These examples are explicitly not customer or project records.
- Connected the new buyer resources into the Services journey.

## Evidence-gated items intentionally not invented

This release does not invent or infer missing personnel biographies, qualifications, licenses, project examples, customer outcomes, corporate past performance, staffing capacity, geographic coverage, insurance data, contract vehicles, government relationships, training availability, response times, security capabilities, accreditation, credential authority, or private supplier-qualification records.

Individual prior-employer experience remains explicitly separated from Safety Assurance Global corporate experience. Opportunity-specific qualification records remain controlled and must be verified against the actual buyer or procurement requirement before use.

## Release boundary

This candidate is not considered production-live until the pull request has been reviewed, the repository's full validation matrix has passed on the exact candidate head, that exact qualified head has been merged to `main`, the existing Cloudflare Pages production workflow has completed successfully, and hosted production routes have been reverified.
