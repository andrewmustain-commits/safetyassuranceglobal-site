# Document: METADATA-STANDARD
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, ARTICLE-TEMPLATE.md, CONTROLLED-VOCABULARY.md, REVIEW-CHECKLIST.md

## Purpose
This standard defines required article front matter metadata for Safety Assurance Global governed content. It ensures article records are complete, consistent, searchable, reviewable, and compatible with repository content processing.

## Metadata Field Definitions

### title
- Purpose: Human-readable article title displayed in listings and article views.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Non-empty text; unique in practical use.
- Validation rules: Must not be blank; should be clear and specific; avoid trailing punctuation unless grammatically required.
- Example: Operational Readiness in Assurance Programs

### slug
- Purpose: Stable URL path segment for the article.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Lowercase letters, numbers, and hyphens.
- Validation rules: Must be unique; no spaces; no uppercase; no special characters other than hyphen.
- Example: operational-readiness-assurance-programs

### author
- Purpose: Declares content ownership/author attribution.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Safety Assurance Global or approved author value defined by governance.
- Validation rules: Must not be blank; default organizational author should be used unless exception is approved.
- Example: Safety Assurance Global

### createdDate
- Purpose: Date the article record was originally created.
- Required (Yes/No): Yes
- Data type: String (date)
- Allowed values: ISO date format YYYY-MM-DD.
- Validation rules: Must be valid calendar date; cannot be empty.
- Example: 2026-07-01

### publishDate
- Purpose: Planned or actual publication date used in ordering and lifecycle controls.
- Required (Yes/No): Yes
- Data type: String (date)
- Allowed values: ISO date format YYYY-MM-DD.
- Validation rules: Must be valid calendar date; should be on or after createdDate unless approved exception exists.
- Example: 2026-07-15

### lastModified
- Purpose: Most recent metadata or body content update date.
- Required (Yes/No): Yes
- Data type: String (date)
- Allowed values: ISO date format YYYY-MM-DD.
- Validation rules: Must be valid date; should be equal to or later than createdDate.
- Example: 2026-07-20

### category
- Purpose: Primary content category for governance grouping and navigation.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Only approved values from CONTROLLED-VOCABULARY.md categories.
- Validation rules: Must exactly match controlled vocabulary value and capitalization standard.
- Example: Assurance

### knowledgeDomain
- Purpose: Subject domain classification for internal knowledge architecture.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Only approved values from CONTROLLED-VOCABULARY.md knowledge domains.
- Validation rules: Must exactly match approved domain value.
- Example: Governance

### tags
- Purpose: Supporting topical keywords for search and cross-linking.
- Required (Yes/No): Yes
- Data type: Array of strings
- Allowed values: Approved controlled terms and relevant descriptive keywords.
- Validation rules: Must be a YAML list; each entry non-empty; avoid duplicates; align with controlled vocabulary where applicable.
- Example: [readiness, assurance, governance]

### description
- Purpose: Concise article summary for previews and metadata cards.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Plain text summary.
- Validation rules: Must not be empty; should describe scope and value clearly without unsupported claims.
- Example: A governance-focused framework for operational readiness in assurance programs.

### seoTitle
- Purpose: Search-optimized title metadata.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Plain text title aligned with article subject.
- Validation rules: Must not be blank; should align with title and avoid misleading claims.
- Example: Operational Readiness Framework for Assurance Programs

### seoDescription
- Purpose: Search-optimized description metadata.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: Plain text description aligned with article content.
- Validation rules: Must not be blank; should remain factual and concise.
- Example: Learn a governance-based approach to operational readiness across assurance workflows.

### featured
- Purpose: Flags whether content receives featured treatment in listing experiences.
- Required (Yes/No): Yes
- Data type: Boolean
- Allowed values: true or false
- Validation rules: Must be explicit boolean; no string equivalents.
- Example: false

### featuredImage
- Purpose: Primary image path for cards and article presentation.
- Required (Yes/No): Yes
- Data type: String (path)
- Allowed values: Repository-relative web path to approved image asset.
- Validation rules: Must begin with /images/blog/ for standard articles; file extension should match approved formats; referenced file must exist and be approved.
- Example: /images/blog/operational-readiness.webp

### draft
- Purpose: Lifecycle gate indicating publication readiness state.
- Required (Yes/No): Yes
- Data type: Boolean
- Allowed values: true or false
- Validation rules: Draft must remain true until approvals are complete.
- Example: true

### reviewStatus
- Purpose: Human-readable governance review state.
- Required (Yes/No): Yes
- Data type: String
- Allowed values: draft, review, approved, published, periodic-review, updated, archived
- Validation rules: Must match controlled lifecycle status labels; must align with draft and workflow state.
- Example: draft

## Metadata Validation Guidance
- Validate YAML structure and field presence before review.
- Enforce required fields with non-empty values where applicable.
- Enforce date format as YYYY-MM-DD and validate real calendar dates.
- Enforce boolean fields as true/false, not quoted strings.
- Enforce taxonomy fields against controlled vocabulary.
- Validate slug formatting and uniqueness.
- Validate image path format and asset availability.
- Ensure reviewStatus is consistent with draft and workflow stage.
- Revalidate metadata whenever content is materially updated.

## Related Documents
- CONTENT-GOVERNANCE-STANDARD.md
- ARTICLE-TEMPLATE.md
- CONTROLLED-VOCABULARY.md
- BLOG-STYLE-GUIDE.md
- PUBLICATION-WORKFLOW.md
- REVIEW-CHECKLIST.md
