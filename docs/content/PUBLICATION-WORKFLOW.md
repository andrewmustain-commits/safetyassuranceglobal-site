# Document: PUBLICATION-WORKFLOW
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, BLOG-STYLE-GUIDE.md, METADATA-STANDARD.md, ARTICLE-TEMPLATE.md, REVIEW-CHECKLIST.md, AI-CONTENT-GOVERNANCE.md

## Purpose
This document defines the governed workflow for moving content from drafting through publication and maintenance. It separates lifecycle status control from human review routing to ensure traceability and approval integrity.

## Content Lifecycle

### Draft
- Responsibilities:
	- Author creates article using approved template and metadata standard.
- Gates:
	- Required front matter fields completed.
	- Initial quality self-check completed.
- Inputs:
	- Topic brief, approved vocabulary, article template.
- Outputs:
	- Draft markdown file with valid metadata and initial body content.

### Review
- Responsibilities:
	- Author submits for formal review.
	- Reviewers evaluate technical, legal/regulatory (as needed), and editorial quality.
- Gates:
	- Review checklist initiated.
	- Evidence and citation requirements satisfied.
- Inputs:
	- Draft article, source references, checklist.
- Outputs:
	- Review comments, required revisions, or conditional pass decision.

### Approved
- Responsibilities:
	- Executive Reviewer grants final approval once all required reviews are complete.
- Gates:
	- Technical review completed.
	- Legal review completed when applicable.
	- Executive approval recorded.
- Inputs:
	- Updated article, completed checklist, reviewer sign-off evidence.
- Outputs:
	- Approval-ready article authorized for repository workflow progression.

### Published
- Responsibilities:
	- Repository Maintainer merges approved changes through standard repository controls.
	- Platform deployment occurs through normal Cloudflare-linked workflow.
- Gates:
	- Approved status set.
	- Repository commit/merge completed.
- Inputs:
	- Approved article commit.
- Outputs:
	- Publicly available content in deployed site build.

### Periodic Review
- Responsibilities:
	- Author and designated reviewers perform scheduled reassessment of published content.
- Gates:
	- Review interval reached or triggered review event identified.
	- Source and policy validity reconfirmed.
- Inputs:
	- Published article, current evidence set, governance updates.
- Outputs:
	- Periodic review decision: retain as-is, update required, or archive recommendation.

### Updated
- Responsibilities:
	- Author and reviewers process material updates under the same governance controls.
- Gates:
	- Change rationale documented.
	- Metadata and lastModified updated.
	- Required re-review completed.
- Inputs:
	- Published article, change request, new evidence.
- Outputs:
	- Revised approved article version.

### Archived
- Responsibilities:
	- Repository Maintainer and Executive Reviewer oversee retirement of outdated content.
- Gates:
	- Archive rationale documented.
	- Replacement or redirect strategy defined where needed.
- Inputs:
	- Article lifecycle history and archival decision.
- Outputs:
	- Archived record with traceable governance history.

## Review Workflow

### Author
- Responsibilities:
	- Draft content and complete metadata.
	- Confirm controlled vocabulary and trademark usage.
- Gates:
	- Article meets draft completeness standard.
- Inputs:
	- Template, style guide, metadata standard.
- Outputs:
	- Review-ready draft submission.

### Technical Review
- Responsibilities:
	- Verify technical correctness, internal consistency, and evidence quality.
- Gates:
	- No unresolved critical technical issues.
- Inputs:
	- Draft article and referenced sources.
- Outputs:
	- Technical pass or revision requests.

### Legal Review (when applicable)
- Responsibilities:
	- Validate legal, compliance, regulatory, and trademark-sensitive claims.
- Gates:
	- No unresolved legal/regulatory concerns.
- Inputs:
	- Draft article, legal-sensitive sections, source references.
- Outputs:
	- Legal pass, conditional pass, or mandatory corrections.

### Executive Review
- Responsibilities:
	- Confirm strategic alignment and governance compliance.
	- Provide final authorization decision.
- Gates:
	- Required prior reviews complete.
	- Checklist complete and evidence available.
- Inputs:
	- Reviewed article package and sign-off records.
- Outputs:
	- Approval decision (approve or return for revision).

### Repository Commit
- Responsibilities:
	- Merge approved content through pull request workflow.
	- Preserve audit trail of review and approval.
- Gates:
	- Executive approval confirmed.
	- Repository checks passed as required.
- Inputs:
	- Approved pull request and final article files.
- Outputs:
	- Committed and merged changes in repository history.

### Cloudflare Deployment
- Responsibilities:
	- Deployment occurs through standard connected deployment workflow.
- Gates:
	- Successful repository integration on deployment branch.
- Inputs:
	- Merged repository state.
- Outputs:
	- Deployed site update reflecting approved content changes.

## Governance Notes
- This workflow does not permit direct publishing by authors or AI systems.
- Legal review is mandatory only when topic risk profile requires it.
- Any workflow exception requires documented approval and change control.
