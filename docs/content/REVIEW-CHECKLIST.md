# Document: REVIEW-CHECKLIST
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, BLOG-STYLE-GUIDE.md, METADATA-STANDARD.md, CONTROLLED-VOCABULARY.md, PUBLICATION-WORKFLOW.md, AI-CONTENT-GOVERNANCE.md

## Purpose
This document provides reusable checklists for governed content review. All applicable sections must be completed before final approval and repository publication workflow progression.

## How To Use
1. Copy this checklist into the review record for each article.
2. Mark each item as complete, not applicable, or requires revision.
3. Capture reviewer initials/date for each section.
4. Resolve all required items before executive approval.

## Editorial Checklist
- [ ] Article purpose is clear and aligned to intended audience.
- [ ] Structure is logical with clear heading hierarchy.
- [ ] Tone is professional, factual, and consistent with style guide.
- [ ] Claims are precise and avoid unsupported language.
- [ ] Conclusion and recommendations are clear and actionable.

Reviewer: ____________________  Date: __________

## Metadata Checklist
- [ ] All required front matter fields are present.
- [ ] Field values conform to metadata format rules.
- [ ] Category and knowledge domain use approved vocabulary.
- [ ] `reviewStatus` aligns with current workflow stage.
- [ ] `lastModified` reflects current revision state.

Reviewer: ____________________  Date: __________

## SEO Checklist
- [ ] `seoTitle` is specific and aligned with article title.
- [ ] `seoDescription` is accurate and concise.
- [ ] Slug is readable, stable, and properly formatted.
- [ ] Headings support search intent without keyword stuffing.
- [ ] Metadata and article body intent are aligned.

Reviewer: ____________________  Date: __________

## Accessibility Checklist
- [ ] Heading structure is sequential and meaningful.
- [ ] Image alt text is present and descriptive where required.
- [ ] Link text is descriptive and understandable out of context.
- [ ] Content is readable with concise paragraphing and clear lists.
- [ ] No accessibility-impacting markdown issues are present.

Reviewer: ____________________  Date: __________

## Links Checklist
- [ ] All internal links resolve correctly.
- [ ] All external links resolve and are authoritative.
- [ ] No placeholder, broken, or redirect-loop links remain.
- [ ] Linked resources support related claims.
- [ ] Link destinations are current and not superseded without note.

Reviewer: ____________________  Date: __________

## Images Checklist
- [ ] Featured image path is valid and file exists.
- [ ] Image usage rights are documented and approved.
- [ ] Image content is relevant and non-misleading.
- [ ] File naming follows approved conventions.
- [ ] Image format and quality meet repository standards.

Reviewer: ____________________  Date: __________

## Copyright Checklist
- [ ] No unapproved copyrighted text is reproduced.
- [ ] Third-party content usage permissions are verified.
- [ ] Required attributions are included where applicable.
- [ ] Quotations are accurate and source-aligned.
- [ ] No licensing conflicts are identified.

Reviewer: ____________________  Date: __________

## Trademark Checklist
- [ ] Trademarked terms use exact approved spellings.
- [ ] Trademark symbols and capitalization are correct.
- [ ] No unapproved brand variants are present.
- [ ] Product naming is consistent across metadata and body.
- [ ] Trademark references comply with controlled vocabulary.

Reviewer: ____________________  Date: __________

## Regulatory Accuracy Checklist
- [ ] Regulatory statements are factually correct and current.
- [ ] Jurisdictional scope is explicitly stated where needed.
- [ ] Legal interpretation is distinguished from source fact.
- [ ] Evidence supports all regulatory/compliance claims.
- [ ] Legal review completed when applicable.

Reviewer: ____________________  Date: __________

## Markdown Formatting Checklist
- [ ] YAML front matter is valid and parseable.
- [ ] Markdown syntax is valid with no broken blocks.
- [ ] Heading levels are properly nested.
- [ ] Lists, tables, and code blocks render correctly.
- [ ] No unresolved merge markers or placeholder text remains.

Reviewer: ____________________  Date: __________

## Astro Compatibility Checklist
- [ ] Front matter fields align with repository content schema usage.
- [ ] File location and naming align with content collection expectations.
- [ ] Markdown content renders correctly in Astro templates.
- [ ] Referenced assets and paths resolve in site build context.
- [ ] No incompatible markdown patterns are introduced.

Reviewer: ____________________  Date: __________

## Executive Approval Checklist
- [ ] Editorial, technical, and required legal checks are complete.
- [ ] All required revisions are resolved.
- [ ] Final content aligns with governance standards.
- [ ] Approval decision is recorded with reviewer identity/date.
- [ ] Article status updated to approved state before commit progression.

Reviewer: ____________________  Date: __________

## Repository Readiness Checklist
- [ ] File path and filename are correct.
- [ ] Metadata and content are final for current lifecycle stage.
- [ ] Governance-related references are up to date.
- [ ] Commit scope is limited to approved content changes.
- [ ] Pull request summary includes review and approval evidence.

Reviewer: ____________________  Date: __________

## Final Gate
- [ ] All required checklist sections completed.
- [ ] Exceptions (if any) documented and approved.
- [ ] Content package is ready for governed repository workflow.
