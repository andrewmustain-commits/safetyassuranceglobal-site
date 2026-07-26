# WEBSITE-DEFECT-REGISTER

Date: 2026-07-26
Phase: 1 of 5

Severity scale:
- P0 Critical
- P1 High
- P2 Medium
- P3 Low

## Defect Register

| Defect ID | Severity | Route or Component | Description | Business Impact | Required Correction | Verification Method | Disposition |
|---|---|---|---|---|---|---|---|
| WEB-DEF-001 | P0 Critical | `/blog/infrastructure-of-integrity-risk-governance` | Article contains numerous unsupported/high-risk public claims (status, capability, operational availability, proprietary frameworks, federal-facing positioning) that are not substantiated in this repo evidence set. | Legal, credibility, and commercial risk; elevated risk of public misrepresentation. | Rewrite article to substantiated public-safe claims only; remove or qualify unverified statements; require executive/legal signoff. | Claims-by-claims evidence review against approved source package. | Hold |
| WEB-DEF-002 | P1 High | `/`, `/command`, shared home components | Positioning language emphasizes "command center" and product-like narratives over independent assurance consulting position required for phase target. | Market confusion and lower message clarity for consulting buyers. | Rewrite core narrative to "Independent Assurance for Maritime and Critical Infrastructure". | Executive content review + copy QA against positioning standard. | Rewrite |
| WEB-DEF-003 | P1 High | `/academy`, `/training`, `/services`, `/command` | Public website messaging over-couples consulting site with Academy/Command as if integrated runtime systems. | Blurs system boundary and increases expectation risk for unavailable offerings. | Add boundary-safe language and reduce cross-system dependency framing. | Content policy QA against system-boundary checklist. | Rewrite |
| WEB-DEF-004 | P1 High | `/command` | Route communicates platform capability set and demonstration CTAs without public evidence package of availability/scope/version. | Potential unsupported product availability claims. | Reframe as method/approach page or hold until substantiation package exists. | Evidence checklist + executive confirmation. | Hold |
| WEB-DEF-005 | P1 High | `/industries` | Government/federal support messaging appears without public substantiation artifacts in repo. | Procurement credibility and compliance risk. | Qualify statements and add proof-governed language pending confirmation package. | Claims register closure for government-related claims. | Rewrite |
| WEB-DEF-006 | P1 High | Global IA | Current route architecture lacks most of the approved target IA sections (maritime, government, service/industry children, insights taxonomy, request-proposal). | Limits conversion pathways, discoverability, and execution sequencing for phase rollout. | Implement proposed IA in phased rollout with consolidation/redirect controls. | Route acceptance checklist in Phase 2+ implementation. | Rewrite |
| WEB-DEF-007 | P2 Medium | `/contact` | No structured contact form; conversion is mailto-only. | Reduced conversion reliability and weak lead capture telemetry. | Add controlled public inquiry form with minimal required fields and anti-spam protections. | Form submission test + mobile UX validation. | Rewrite |
| WEB-DEF-008 | P2 Medium | `/terms` and `/terms-of-use` | Duplicate legal intent split across two routes; one is thin. | Legal ambiguity and SEO duplication. | Consolidate legal terms into one canonical endpoint and redirect legacy route. | Route response and canonical checks post-redirect. | Redirect |
| WEB-DEF-009 | P2 Medium | Site routing | No explicit custom 404 route in source pages. | Poor not-found UX and missed recovery CTA opportunities. | Add dedicated 404 page aligned with primary CTA. | Build route existence + manual navigation test. | Rewrite |
| WEB-DEF-010 | P2 Medium | Site syndication | No `rss.xml` route found. | Missed content syndication/distribution channel. | Add RSS output for insights/blog collection. | Validate generated `rss.xml` in build output. | Rewrite |
| WEB-DEF-011 | P2 Medium | Deployment config | No repository-level `_redirects` file present to preserve legacy URLs during IA transition. | Legacy links may fail during future route migration. | Add controlled redirect map in implementation phase. | Redirect test matrix for legacy URLs. | Rewrite |
| WEB-DEF-012 | P2 Medium | Deployment config | No repository-level `_headers` file with explicit security/cache headers baseline. | Inconsistent edge behavior and harder security hardening. | Add Cloudflare-compatible headers baseline. | Header validation in preview/prod response checks. | Rewrite |
| WEB-DEF-013 | P2 Medium | `.github/workflows/build-validation.yml` | Workflow uses Node 24 while project baseline calls for Node 22.12.0 compatibility control. | CI drift risk vs production runtime baseline. | Align CI runtime to supported Node 22 baseline. | CI run with pinned Node 22.x. | Rewrite |
| WEB-DEF-014 | P2 Medium | `src/content.config.ts` | Astro check reports repeated deprecation hints for `z` import usage. | Future upgrade friction and avoidable technical debt. | Migrate to supported schema API per Astro guidance. | `npm run check` hints reduced/cleared for content schema. | Rewrite |
| WEB-DEF-015 | P2 Medium | `src/content/blog/infrastructure-of-integrity-risk-governance.md` | External third-party CDN-hosted images are embedded in public content body. | External dependency risk for availability/trust/control. | Replace with governed first-party hosted assets in `public/`. | Build output asset-link validation and content review. | Rewrite |
| WEB-DEF-016 | P2 Medium | Structured data implementation | Structured data appears in layout and inline markdown; no centralized utility or policy guard. | Inconsistent metadata quality and change-control risk. | Implement centralized structured-data helper and publication checks. | Schema validation and linting in CI pipeline. | Rewrite |
| WEB-DEF-017 | P3 Low | `src/components/ui/Container.astro` | Unused `Props` interface hint in check output. | Low-risk code hygiene issue. | Remove unused type or use it explicitly. | `npm run check` hint review. | Retain |

## Severity Totals

- P0 Critical: 1
- P1 High: 5
- P2 Medium: 10
- P3 Low: 1
