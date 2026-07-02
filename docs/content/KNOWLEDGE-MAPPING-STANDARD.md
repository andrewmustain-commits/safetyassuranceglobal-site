# Knowledge Mapping Standard (CONTENT-005)

Report date: 2026-07-02
Purpose: Define how governed content should be mapped across Academy, Services, and AI-oriented knowledge surfaces using repository truth.

## Scope
This standard defines classification and mapping rules for:
- Blog knowledge content (`src/content/blog/`)
- Academy-facing learning content references
- Services-facing solution content references
- AI knowledge mapping readiness documentation

This standard does not create or publish new articles.

## Authoritative Inputs
- `docs/content/CONTROLLED-VOCABULARY.md`
- `docs/content/METADATA-STANDARD.md`
- `docs/content/ARTICLE-TEMPLATE.md`
- `docs/content/CONTENT-INVENTORY-REPORT.md`

## Mapping Dimensions
Each approved article should be mapped across these dimensions:
1. Primary Category (controlled value)
2. Knowledge Domain (controlled value)
3. Service Alignment (which service capability it supports)
4. Academy Alignment (which learning pathway it supports)
5. Command/AI Alignment (operational intelligence relevance)
6. Lifecycle State (approved/published/etc. in governance terms)

## Minimum Mapping Record
For each approved article record:
- Filename
- Slug
- Category
- Tags
- Publish Date (or active `date` field until schema expansion)
- Academy alignment note
- Services alignment note
- Command/AI alignment note
- Evidence/reference note (internal links only)

## Mapping Rules
- Use controlled vocabulary values exactly for category/domain fields.
- Do not infer missing articles or missing approvals.
- Do not map draft/private articles to public knowledge surfaces.
- Keep mappings traceable to files that exist in repository.
- Use internal links only when referencing related repository content.

## Quality Gates
Before accepting a mapping update:
1. Article exists in repository.
2. Article is approved for public blog if mapped as public content.
3. Taxonomy terms match controlled vocabulary.
4. Mapping notes are factual and non-speculative.
5. Build remains unaffected.

## Operational Guidance
- Maintain mapping matrix in `docs/content/KNOWLEDGE-DOMAIN-MATRIX.md`.
- Update matrix whenever approved article set changes.
- Re-check alignment when schema or taxonomy changes.

## Constraints
- No deployment changes.
- No external systems integration in this phase.
- No AI auto-publishing behavior.
