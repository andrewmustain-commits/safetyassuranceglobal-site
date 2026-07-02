# Document: AI-CONTENT-GOVERNANCE
# Version: 1.0.0
# Status: Draft
# Owner: Safety Assurance Global LLC
# Approver: Executive Reviewer
# Effective Date: 2026-07-01
# Next Review: 2026-10-01
# Related Documents: CONTENT-GOVERNANCE-STANDARD.md, BLOG-STYLE-GUIDE.md, METADATA-STANDARD.md, PUBLICATION-WORKFLOW.md, REVIEW-CHECKLIST.md

## Purpose
This document establishes mandatory controls for the use of AI in creating and maintaining governed content. AI is an assistive tool only and does not replace human accountability, review, or approval authority.

## Allowed AI Activities
AI may be used to:
- Draft article outlines and first-pass markdown content.
- Improve readability, clarity, and structure.
- Generate markdown formatting and section scaffolds.
- Suggest metadata values based on approved standards.
- Flag missing evidence, weak claims, or incomplete sections.
- Propose internal linking opportunities.

## Prohibited AI Activities
AI may not:
- Publish content directly.
- Invent citations, sources, or references.
- Invent regulations, legal requirements, or compliance obligations.
- Bypass technical, legal, or executive review steps.
- Override governance rules, controlled vocabulary, or metadata requirements.
- Introduce copyrighted material without explicit approval and rights verification.
- Commit or merge content changes without human authorization.

## Human Approval Requirements
- Every AI-assisted content artifact requires named human author accountability.
- Technical review is required before executive review.
- Legal/regulatory review is required when content includes legal or regulatory claims.
- Executive Reviewer approval is mandatory before repository publication workflow progression.
- No AI-generated recommendation may be treated as approved without human sign-off.

## Evidence Requirements
- Material factual claims must be supported by verifiable evidence.
- AI-suggested claims require human verification against primary or authoritative sources.
- Evidence must be sufficient to support conclusions and recommendations.
- Unsupported statements must be removed or rewritten as clearly labeled opinion/context.

## Citation Rules
- Citations must reference real, verifiable sources.
- Citation text must match the underlying source intent.
- Secondary summaries must not be represented as primary authority.
- Fabricated references are strictly prohibited.
- Where source uncertainty exists, mark for review and do not publish pending resolution.

## Hallucination Prevention
- Treat all AI outputs as unverified until validated.
- Require source-backed confirmation for factual, legal, and regulatory claims.
- Use checklist-based verification before review transitions.
- Reject generated content containing unverifiable entities, statutes, or standards.
- Record significant corrections arising from AI inaccuracies during review.

## Repository Safety Rules
- AI-assisted edits must occur through normal version-controlled pull request processes.
- Do not add secrets, API keys, tokens, or credentials to repository content.
- Do not modify production data or deployment configuration through AI-generated changes.
- Keep AI activity limited to approved content and documentation scope.
- Preserve auditability of changes and reviewer decisions.

## Publishing Restrictions
- AI systems are not publishing authorities.
- AI cannot trigger deployment, release, or publication actions.
- Publication requires completion of governed review workflow and explicit executive approval.
- All deployment outcomes must occur through standard repository-integrated workflow controls.

## Enforcement
Non-compliance with this standard requires immediate remediation, documented corrective action, and review by governance owners before further progression.
