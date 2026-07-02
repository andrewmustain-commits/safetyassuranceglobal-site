# Content Inventory Report

**Report Date:** 2026-07-02  
**Scope:** Repository content classified by status and conversion state  
**Authority:** Repository truth only (no inferred or missing content)

---

## Blog Articles Inventory

### Approved Articles

| Filename | Current Location | Status | Conversion Status | Notes |
|----------|------------------|--------|-------------------|-------|
| assurance-framework-performance.md | `src/content/blog/` | Approved | ✅ Already Converted | 9-field Astro schema, published 2026-06-01, 3 sections |
| approved-launch-update.md | `content/blog/` | Approved | ⏳ Needs Conversion | Staging area, requires schema upgrade, 2-field source |

### Draft Articles

| Filename | Current Location | Status | Conversion Status | Notes |
|----------|------------------|--------|-------------------|-------|
| pilot-checklist-draft.md | `src/content/blog/` | Draft | ✅ Already Converted | 9-field Astro schema, internal validation workflow |
| draft-internal-roadmap.md | `content/blog/` | Draft | ⏸️ Not Converted | Staging area, left untouched per governance policy |

---

## Governance Documents (Non-Blog Content)

Located in `/docs/content/` — internal governance library, not rendered as blog articles.

| Document | Purpose | Authority Level | Status |
|----------|---------|-----------------|--------|
| CONTENT-GOVERNANCE-STANDARD.md | Governing authority for all content policy | Level 1 (Highest) | CONTENT-001 |
| README.md | Governance library entry point and reading order | Level 12 (Entry) | CONTENT-001 |
| ARTICLE-TEMPLATE.md | Frozen v1.0 template for governed blog articles | Level 3 (Standards) | CONTENT-001 |
| METADATA-STANDARD.md | Field definitions and validation for all articles | Level 4 (Standards) | CONTENT-001 |
| CONTROLLED-VOCABULARY.md | Approved categories, domains, trademarks, abbreviations | Level 5 (Standards) | CONTENT-001 |
| PUBLICATION-WORKFLOW.md | Content lifecycle and review routing | Level 6 (Operations) | CONTENT-001 |
| BLOG-STYLE-GUIDE.md | Editorial and writing standards | Level 7 (Operations) | CONTENT-001 |
| REVIEW-CHECKLIST.md | Quality gates for all review phases | Level 8 (Operations) | CONTENT-001 |
| AI-CONTENT-GOVERNANCE.md | AI use boundaries and prohibitions | Level 9 (Audit) | CONTENT-001 |
| EDITORIAL-CALENDAR.md | Content planning and publishing schedule | Level 10 (Audit) | CONTENT-001 |
| CHANGELOG.md | Governance library version history | Level 11 (Audit) | CONTENT-001 |
| CONTENT-INDEX.md | Navigation map and authority hierarchy | Level 2 (Authority) | CONTENT-001 |

---

## Summary

**Total Blog Articles:** 4
- Approved: 2 (1 converted, 1 pending conversion)
- Draft: 2 (both left untouched)

**Total Governance Documents:** 12 (CONTENT-001 framework, committed)

**Conversion Tasks Remaining:** 1 (approved-launch-update.md)

**Draft Content Disposition:** 2 articles remain in staging/draft status per governance policy

---

## Gap Analysis: Missing Approved Articles

**Expected vs. Repository Truth:**

Based on CONTENT-001 governance framework and EDITORIAL-CALENDAR.md planning structure, the repository **currently contains only 2 approved articles**:

1. ✅ assurance-framework-performance.md (published 2026-06-01)
2. ⏳ approved-launch-update.md (pending conversion, staged 2026-06-20)

**Missing Approved Articles from Expected Business Roadmap:**

The EDITORIAL-CALENDAR.md template includes placeholders for future articles but provides no concrete specification of which approved articles should exist. The business roadmap is not documented in the repository, therefore **no gap can be quantified**.

**Recommended Next Steps (Business Decision):**

1. Define approved article list in EDITORIAL-CALENDAR.md with target dates and authors
2. Submit approved articles to `content/blog/` in staging area with `status: approved`
3. Run CONTENT-002 Task 5 conversion process for each batch

**Note:** CONTENT-002 Task 5 requested conversion of "15 remaining approved articles," but no source for this number exists in the repository. This gap should be resolved by the business before mass conversion tasks are initiated.

---

## Repository Structure Reference

```
src/content/blog/          ← Astro collection (rendered publicly)
  assurance-framework-performance.md
  pilot-checklist-draft.md

content/blog/              ← Staging area (awaiting conversion)
  approved-launch-update.md
  draft-internal-roadmap.md

docs/content/              ← Governance library (not rendered)
  (12 governance documents)
```
