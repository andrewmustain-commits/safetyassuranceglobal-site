# Release and Tagging Guide

Date: 2026-07-02
Purpose: Standardize release signaling and changelog traceability.

## Commit Message Convention
Recommended format:
- TYPE-SCOPE: short description

Examples:
- HARDEN-001: add repository hardening baseline docs
- CONTENT-003: add migration discovery and knowledge readiness

Allowed TYPE values:
- HARDEN
- CONTENT
- DOCS
- CI
- FIX

## Release Tagging Process
1. Ensure working tree is clean.
2. Ensure required status checks are passing on target commit.
3. Confirm release notes/changelog entry is prepared.
4. Create annotated tag using semantic versioning policy.
5. Push tag only after approval.

Example commands:
- git tag -a v1.0.1 -m "Release v1.0.1"
- git show v1.0.1

## Tagging Rules
- Use annotated tags, not lightweight tags.
- Never retag an existing release version.
- Tag only commits that passed required checks.
- Keep changelog and release notes aligned with tag scope.

## Rollback Guidance for Bad Release Tags
1. Do not rewrite history without approval.
2. If release was bad, create a corrective commit.
3. Cut a new patch tag with clear release notes.
4. Document incident and corrective action in hardening log.
