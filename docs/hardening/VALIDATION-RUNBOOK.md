# Validation Runbook

Date: 2026-07-02
Purpose: Define available validation commands and when to run them.

## Available Package Validation Scripts
From package.json:
- npm run build
- npm run check
- npm run blog:validate

## Core Validation Sequence
1. npm run blog:validate
2. npm run check
3. npm run build

## Repository State Checks
- git status --short
- git diff --stat

## When to Run
- Before opening a PR.
- After significant content/schema changes.
- Before merge approval.
- Before creating release tags.

## Failure Handling
If any validation fails:
1. Stop merge/release progression.
2. Capture failing command output.
3. Revert or fix only scoped changes.
4. Re-run full validation sequence.

## Rollback Guidance
For local uncommitted failures:
- Revert working changes in affected files only after confirmation.
- Re-run validation.

For committed failures:
- Use a new corrective commit or approved revert commit.
- Re-run validation and checks before next merge attempt.
