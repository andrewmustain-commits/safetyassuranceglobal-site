# HARDEN-001 Repository Hardening Plan

Date: 2026-07-02
Scope: Repository governance and delivery hardening without runtime behavior changes.

## Objectives
1. Reduce accidental risk in pull requests and main branch merges.
2. Make validation gates explicit and repeatable.
3. Standardize commit/release process for auditability.
4. Prevent sensitive or build-artifact files from entering version control.
5. Keep hardening controls aligned with existing workflows.

## In Scope
- Branch and merge controls (GitHub settings guidance).
- Required status checks and review gates.
- Validation and rollback runbook references.
- Documentation standards for release tagging and pre-merge checks.

## Out of Scope
- Site feature changes.
- Cloudflare or production deployment changes.
- Secrets management changes beyond guardrails/documentation.

## Baseline Observations
- Branch: main
- Existing workflows:
  - .github/workflows/pr-build.yml
  - .github/workflows/build-validation.yml
  - .github/workflows/codeql.yml
- No CODEOWNERS file found.
- No issue or PR templates found.

## Hardening Workstreams
1. Branch protection baseline (see BRANCH-PROTECTION-RECOMMENDATIONS.md).
2. Validation enforcement baseline (see VALIDATION-RUNBOOK.md).
3. Release and tag governance baseline (see RELEASE-TAGGING-GUIDE.md).
4. Pre-merge and content safety controls (see REPOSITORY-HARDENING-CHECKLIST.md).
5. Ongoing tracking and evidence (see HARDENING-LOG.md).

## Success Criteria
- Required checks defined and documented.
- Pre-merge checklist available and used.
- Release tagging process documented.
- Repository contains no unsafe artifacts or secrets.
- All hardening files are documentation-only and do not alter runtime behavior.
