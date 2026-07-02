# Branch Protection Recommendations

Date: 2026-07-02
Target branch: main
Purpose: Define branch protection settings for repository hardening.

## Required Branch Protection Rules
1. Require a pull request before merging.
2. Require at least 1 approving review.
3. Dismiss stale approvals when new commits are pushed.
4. Require conversation resolution before merge.
5. Require status checks to pass before merge.
6. Require branch to be up to date before merge.
7. Restrict force pushes.
8. Restrict branch deletions.

## Required Status Checks (Recommended)
- Build Validation / build
- PR Build Validation / build
- CodeQL Analysis / Analyze (javascript-typescript)
- CodeQL Analysis / Analyze (actions)

## Optional Hardening Upgrades
- Require 2 approvals for high-risk changes.
- Enable code-owner reviews after CODEOWNERS is introduced.
- Restrict who can push directly to main.

## CODEOWNERS Recommendation
Current state: no CODEOWNERS file detected.
Recommendation: add CODEOWNERS in a separate approved change to enforce reviewer ownership by path.

## PR/Issue Template Recommendation
Current state: no PR templates or issue templates detected.
Recommendation: add templates in a separate approved change to improve change quality and risk capture.
