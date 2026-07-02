# Document: BLOG-STYLE-GUIDE
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, METADATA-STANDARD.md, CONTROLLED-VOCABULARY.md, ARTICLE-TEMPLATE.md, REVIEW-CHECKLIST.md

## Purpose
This style guide defines mandatory editorial, structural, and quality standards for Safety Assurance Global governed content. It ensures consistency, clarity, legal defensibility, and alignment with approved brand language.

## Editorial Principles
- Accuracy first: Prefer verified facts over opinion.
- Governance-first publishing: Content must satisfy controls before release.
- Clarity over complexity: Write for executive and practitioner readability.
- Traceability: Key claims must be attributable to verifiable sources.
- Consistency: Use approved terminology, capitalization, and metadata.

## Writing Standards
- Voice: Professional, direct, and evidence-based.
- Tone: Confident, factual, and non-promotional unless explicitly required.
- Structure:
	- Clear title and summary-oriented introduction
	- Logical headings with scannable sections
	- Actionable conclusions or recommendations
- Formatting:
	- Use short paragraphs and concise bullet lists
	- Define acronyms on first use unless approved abbreviation
	- Avoid unsupported claims, ambiguous language, and hype terms
- Prohibited practices:
	- Invented facts, citations, or regulations
	- Unattributed legal claims
	- Unapproved trademark variations

## Article Metadata Standard
All articles must comply with the governing front matter requirements defined in `METADATA-STANDARD.md` and implemented via `ARTICLE-TEMPLATE.md`. Required fields must be complete before an article can move beyond Draft status.

## Controlled Vocabulary Reference
Approved categories, domains, classifications, abbreviations, and capitalization rules are controlled in `CONTROLLED-VOCABULARY.md`. Authors and reviewers must not introduce unapproved taxonomy terms into governed content.

## Trademark & Brand Usage
- Use approved trademark spellings exactly as defined in `CONTROLLED-VOCABULARY.md`.
- Do not alter punctuation, capitalization, or symbol usage for trademarked terms.
- Do not remove trademark indicators where policy requires inclusion.
- Brand product references must remain consistent across title, body, metadata, and image text.

Required trademark forms include:
- Infrastructure of Integrity™
- SAG Academy™
- SAG Command™
- SAGE-Score™
- SAG SECURE™

## Sources & Evidence
- Every non-obvious factual claim should be supported by a verifiable source.
- Regulatory references must identify the governing body and current publication context.
- Where interpretation is used, distinguish interpretation from source fact.
- Citation integrity rules:
	- No fabricated sources
	- No unverifiable references
	- No citation laundering through secondary summaries without disclosure

## Images & Media
- Use only approved, licensed, or internally owned visual assets.
- Images must support the article's topic and not imply unsupported performance claims.
- Include descriptive alt text aligned to accessibility standards.
- Filenames should be stable and descriptive for repository management.
- Any third-party asset requires documented usage rights and attribution where required.

## SEO Standards
- Provide concise and accurate `seoTitle` and `seoDescription` fields.
- Use meaningful headings and keyword-aligned subheadings without keyword stuffing.
- Ensure slug clarity, relevance, and uniqueness.
- Keep metadata and on-page claims aligned to avoid intent mismatch.
- Internal linking should improve discovery of related governed knowledge.

## Content Lifecycle Governance
This guide applies across the governed lifecycle:
- Draft
- Review
- Approved
- Published
- Periodic Review
- Updated
- Archived

State transitions must follow `PUBLICATION-WORKFLOW.md` and review controls in `REVIEW-CHECKLIST.md`.

## Review Workflow
Minimum review path:
1. Author self-review against this style guide
2. Technical review for correctness and clarity
3. Legal/regulatory review when required by topic
4. Executive review and final approval
5. Repository merge according to governed process

No content is publication-ready until all required reviewers have signed off.

## Quality Checklist
Before approval, verify:
- Structure and tone comply with Writing Standards
- Metadata is complete and valid
- Vocabulary and taxonomy are approved
- Trademark usage is exact
- Sources are verifiable and sufficient
- Images are approved and rights-cleared
- SEO fields are complete and aligned
- Review workflow evidence is documented

Formal acceptance criteria are maintained in `REVIEW-CHECKLIST.md`.

## Change Control
- Proposed changes require pull request documentation and rationale.
- Governance-impacting updates require Executive Reviewer approval.
- Revisions must be reflected in `CHANGELOG.md`.
- Conflicts with higher-authority governance documents defer to `CONTENT-GOVERNANCE-STANDARD.md`.

## Appendix A: Knowledge Architecture
Governed knowledge architecture reference:
- Level 1: Governance standards (policy and controls)
- Level 2: Operational standards (workflow, metadata, vocabulary)
- Level 3: Execution artifacts (templates, checklists, calendars)
- Level 4: Knowledge content (articles and derivative assets)
- Level 5: Evidence and records (sources, approvals, changelogs)

This architecture ensures content integrity, traceability, and controlled evolution.

## Appendix B: Content Classification
All content must map to approved classification dimensions:
- Category
- Knowledge Domain
- Content Classification
- Lifecycle Status
- Review Status

Classification authority and allowed values are defined in `CONTROLLED-VOCABULARY.md` and `METADATA-STANDARD.md`.
