# Document: ARTICLE-TEMPLATE
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, BLOG-STYLE-GUIDE.md, METADATA-STANDARD.md, CONTROLLED-VOCABULARY.md, REVIEW-CHECKLIST.md

## Purpose
This document provides the frozen Article Template v1.0 for governed Markdown content. It standardizes front matter, structure, and quality requirements to support consistency, review readiness, and repository compatibility.

## Usage Instructions
1. Copy the complete YAML front matter template exactly.
2. Populate all required fields before requesting review.
3. Build article content using the Markdown skeleton in this document.
4. Validate links, metadata, and image references.
5. Submit for governed review workflow.

## Complete YAML Front Matter Template
```yaml
---
title: ""
slug: ""
author: "Safety Assurance Global"
createdDate: "YYYY-MM-DD"
publishDate: "YYYY-MM-DD"
lastModified: "YYYY-MM-DD"
category: ""
knowledgeDomain: ""
tags: []
description: ""
seoTitle: ""
seoDescription: ""
featured: false
featuredImage: "/images/blog/filename.webp"
draft: true
reviewStatus: "draft"
---
```

## Required Fields
- `title`
- `slug`
- `author`
- `createdDate`
- `publishDate`
- `lastModified`
- `category`
- `knowledgeDomain`
- `tags`
- `description`
- `seoTitle`
- `seoDescription`
- `featured`
- `featuredImage`
- `draft`
- `reviewStatus`

## Optional Fields
Article Template v1.0 has no optional front matter fields. Additional fields may only be introduced through approved governance change control.

## Markdown Article Skeleton
```markdown
# <Article Title>

## Executive Summary
Brief overview of the key point, decision, or recommendation.

## Context
Background and operating context for the topic.

## Key Considerations
- Consideration 1
- Consideration 2
- Consideration 3

## Analysis
Evidence-based explanation, findings, and implications.

## Recommendations
Specific and actionable recommendations.

## Conclusion
Summary of outcomes and next steps.

## Sources
- Source 1
- Source 2
```

## Image Standards
- Use approved or licensed assets only.
- Preferred format: `webp` unless governance exception applies.
- Keep filenames descriptive and stable.
- Provide meaningful alt text in article body where images are rendered.
- Do not use images that imply unsupported claims.

## Internal Linking Standards
- Include links to related governed content where relevant.
- Use stable relative paths for repository-managed content.
- Avoid broken, circular, or placeholder links.
- Ensure linked documents are current and not superseded without note.

## SEO Guidance
- Ensure `seoTitle` is clear, specific, and aligned with `title`.
- Ensure `seoDescription` is concise, factual, and aligned with article intent.
- Keep heading hierarchy logical (`H1` then `H2`/`H3` as needed).
- Use precise keywords naturally; do not keyword-stuff.

## Example Article Layout
```markdown
---
title: "Operational Readiness in Assurance Programs"
slug: "operational-readiness-assurance-programs"
author: "Safety Assurance Global"
createdDate: "2026-07-01"
publishDate: "2026-07-15"
lastModified: "2026-07-15"
category: "assurance"
knowledgeDomain: "governance"
tags: ["readiness", "assurance", "governance"]
description: "A governance-focused framework for operational readiness in assurance programs."
seoTitle: "Operational Readiness Framework for Assurance Programs"
seoDescription: "Learn a governance-based approach to operational readiness across assurance workflows."
featured: false
featuredImage: "/images/blog/operational-readiness.webp"
draft: true
reviewStatus: "draft"
---

# Operational Readiness in Assurance Programs

## Executive Summary
Operational readiness requires documented controls, review checkpoints, and measurable outcomes.

## Context
Teams often have process documentation but lack consistent governance execution.

## Key Considerations
- Governance ownership
- Evidence quality
- Review cadence

## Analysis
Structured governance reduces rework risk and improves publication quality.

## Recommendations
- Establish role accountability
- Enforce metadata completeness
- Apply formal review checkpoints

## Conclusion
Readiness improves when governance standards are operationalized, not treated as optional.

## Sources
- Internal governance policy references
```

## Validation Requirements
- Front matter must be complete and syntactically valid YAML.
- Required fields must conform to approved formats and controlled values.
- Markdown must render cleanly and maintain heading structure.
- Internal and external links must resolve.
- Image paths must be valid and approved.
- Article must pass review checklist before approval.

## Related Documents
- `CONTENT-GOVERNANCE-STANDARD.md`
- `BLOG-STYLE-GUIDE.md`
- `METADATA-STANDARD.md`
- `CONTROLLED-VOCABULARY.md`
- `REVIEW-CHECKLIST.md`
