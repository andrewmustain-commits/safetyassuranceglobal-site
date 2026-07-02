# Repository Hardening Checklist

Date: 2026-07-02
Use this checklist before merge to main.

## Pre-Merge Checklist
- [ ] Change scope is limited and intentional.
- [ ] No runtime behavior change unless explicitly approved.
- [ ] No edits to content articles unless explicitly approved.
- [ ] Validation commands completed successfully.
- [ ] Required GitHub checks passed.
- [ ] At least one reviewer approved (or policy-required number).
- [ ] Commit messages follow convention.
- [ ] Release impact assessed and documented.

## Required Status Checks
- [ ] Build Validation workflow passed.
- [ ] PR Build Validation workflow passed.
- [ ] CodeQL Analysis passed (or policy-approved exception).
- [ ] Blog frontmatter validation passed when content scope is present.

## Security and Safety Checklist
- [ ] No secrets or credentials committed.
- [ ] No .env files committed.
- [ ] No generated build artifacts committed (dist, .astro, coverage outputs).
- [ ] No archive artifacts committed unless explicitly required and approved.
- [ ] Dependency changes are reviewed for purpose and risk.

## Content Governance Checklist
- [ ] Draft content remains non-public.
- [ ] Approved status gating remains intact.
- [ ] Controlled vocabulary requirements are respected.
- [ ] Review checklist evidence exists for governance-driven content changes.

## What Must Never Be Committed
- Secrets, tokens, credentials, private keys.
- Real environment files (.env and variant files).
- Node modules directory.
- Build output directories (dist, .astro, coverage outputs).
- Temporary logs and local machine artifacts.
- Unapproved copyrighted content.

## Completion Record
Reviewer: ____________________
Date: ____________________
Notes: ____________________
