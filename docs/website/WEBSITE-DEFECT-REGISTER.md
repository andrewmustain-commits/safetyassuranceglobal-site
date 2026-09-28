# WEBSITE-DEFECT-REGISTER

Date: 2026-09-27  
Phase: Operational Authority / production maintenance  
Posture: Stability, Security, Truth

Severity scale:
- P0 Critical
- P1 High
- P2 Medium
- P3 Low

## Current Open / Held Defects

| Defect ID | Severity | Route or Component | Current Condition | Control / Mitigation | Required Closure Evidence | Disposition |
|---|---|---|---|---|---|---|
| WEB-DEF-007 | P1 High | `/contact`, `/request-proposal`, inquiry delivery Worker | Application, Turnstile, Service Binding, Worker deployment, runtime readiness, negative-path checks, and fallback behavior are qualified. The first real Contact positive-path test reached delivery but Cloudflare Email Sending is not enabled on the account because it requires the Workers Paid entitlement. The browser correctly opened the email fallback instead of reporting false success. | Turnstile remains active; server delivery fails closed; prefilled email fallback remains available; Issue #58 remains open. | Enable Cloudflare Email Sending or approve another server-side transport, then complete and independently verify one live Contact and one live Proposal delivery to the approved mailbox. | **HOLD — EXTERNAL ACCOUNT/BILLING GATE** |

## Resolved / Superseded Defects

| Defect ID | Former Severity | Former Concern | Current Evidence / Resolution | Disposition |
|---|---|---|---|---|
| WEB-DEF-001 | P0 | Unsupported high-risk legacy article | Article is held at `claims-review`, excluded from approved listings, and the legacy hosted route redirects to `/insights`. Claims governance validation is enforced in CI. | Resolved |
| WEB-DEF-002 | P1 | Product-like “command center” positioning | Public narrative was rebuilt around independent assurance, operational readiness, evidence, and executive decision support. | Resolved |
| WEB-DEF-003 | P1 | Corporate / Institute / Command boundary confusion | Public claims and cross-system boundaries are governed; Institute remains a separate authority surface and corporate pages do not imply unavailable authority. | Resolved |
| WEB-DEF-004 | P1 | Unsupported Command capability claims | Legacy `/command` redirects to governed `/sag-command`; current page language is subject to public-claims validation. | Resolved |
| WEB-DEF-005 | P1 | Government/federal messaging substantiation | Government and public-sector claims are governed by the public-claims validator and controlled evidence language. | Resolved |
| WEB-DEF-006 | P1 | Incomplete information architecture | Maritime, Government, Capabilities, Industries, Services, Insights, Contact, Proposal, Institute gateway, and supporting routes are implemented and route-validated. | Resolved |
| WEB-DEF-008 | P2 | Duplicate Terms routes | `/terms` and `/terms/` redirect to canonical `/terms-of-use`. | Resolved |
| WEB-DEF-009 | P2 | Hosted unknown routes returned an ambiguous success page | Production smoke verification requires an unknown route to return HTTP 404. | Resolved |
| WEB-DEF-010 | P2 | Missing RSS | `src/pages/rss.xml.ts` generates the governed Insights feed and the layout advertises `/rss.xml`. | Resolved |
| WEB-DEF-011 | P2 | Legacy redirect behavior | Production verification covers governed redirects including blog, terms, academy, command, and security aliases. | Resolved |
| WEB-DEF-012 | P2 | Missing edge security/cache headers | `public/_headers` defines CSP, HSTS, frame protection, permissions policy, referrer policy, MIME protection, and asset cache controls; production verifies key headers. | Resolved |
| WEB-DEF-013 | P2 | Node runtime drift | Current qualified CI/deploy baseline uses Node 24 while the package engine remains compatible from Node 22.12 upward. Node 24 is the accepted operational baseline. | Superseded by qualified baseline |
| WEB-DEF-014 | P2 | Astro content-schema deprecation hints | Current `astro check` no longer reports the former content-schema deprecation set. | Resolved |
| WEB-DEF-015 | P2 | External images in held legacy article | The held article now contains only the controlled claims-review notice and is not publicly published; legacy URL redirects away from it. | Resolved |
| WEB-DEF-016 | P2 | Structured-data inconsistency | Structured data is centralized through the site layout and checked by dedicated CI validation. | Resolved |
| WEB-DEF-017 | P3 | Container Props hygiene | `Container.astro` actively types `Astro.props` with its `Props` interface. The separate unused homepage `Card` import identified during current maintenance is removed in this cleanup. | Resolved |
| WEB-DEF-018 | P2 | Astro production dependency advisories | Dependency maintenance and audit gates cleared the former Astro findings. | Resolved |
| WEB-DEF-019 | P1 | PostCSS advisory | Current dependency audit no longer reports the former PostCSS finding. | Resolved |
| WEB-DEF-020 | P1 | SVGO advisory | Current dependency audit no longer reports the former SVGO finding. | Resolved |
| WEB-DEF-021 | P1 | fast-uri development advisory | Current dependency audit no longer reports the former fast-uri finding. | Resolved |
| WEB-DEF-022 | P2 | Astro language-server advisory chain | Current dependency audit no longer reports the former language-server finding. | Resolved |
| WEB-DEF-023 | P2 | volar-service-yaml advisory | Current dependency audit no longer reports the former Volar YAML finding. | Resolved |
| WEB-DEF-024 | P2 | yaml-language-server advisory | Current dependency audit no longer reports the former YAML language-server finding. | Resolved |
| WEB-DEF-025 | P2 | yaml advisory | Current dependency audit no longer reports the former YAML finding. | Resolved |
| WEB-DEF-026 | P1 | Honeypot-only anti-spam control | Production Turnstile is active. Missing and invalid tokens are rejected in production before delivery. | Resolved |
| WEB-DEF-027 | P1 | Missing CTA/form measurement | Privacy-safe allowlisted measurement events are implemented without collecting form or assistant content. | Resolved |
| WEB-DEF-028 | P2 | Sitemap generation/verification | Sitemap artifacts are generated and validated in build and production workflows. | Resolved |
| WEB-DEF-029 | P0 | Hosted claims-control breach on legacy article | Production redirect and route verification prevent the legacy high-risk article from being served as an approved public article. | Resolved |

## Current Security / Quality Gate

The production workflow currently enforces:

- deterministic dependency installation;
- dependency audit;
- blog/frontmatter governance;
- brand asset validation;
- Turnstile and inquiry-delivery validation;
- static Astro diagnostics;
- production build;
- link validation;
- structured-data validation;
- head metadata validation;
- publication-route validation;
- sitemap validation;
- public UX validation;
- CodeQL;
- Cloudflare Pages production deployment and hosted-route smoke verification;
- post-deployment Lighthouse monitoring.

As part of the 2026-09-27 maintenance cleanup, dependency audit enforcement is tightened from **high** to **moderate** severity because the dependency graph has been returned to zero known npm audit findings.

## Current Disposition Summary

- P0 open: **0**
- P1 open/held: **1** — WEB-DEF-007, external Cloudflare Email Sending entitlement / positive-path delivery acceptance
- P2 open: **0**
- P3 open: **0**
- Institute OS draft work remains outside this corporate-site defect register and stays governed by its own fail-closed authority gates.
