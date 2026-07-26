# WEBSITE-INVENTORY

Date: 2026-07-26
Phase: 1 of 5
Repository: andrewmustain-commits/safetyassuranceglobal-site
Production Domain: https://safetyassuranceglobal.com
Working Branch: website/public-site-full-refresh

## Baseline Confirmation

- Correct repository remote confirmed: `https://github.com/andrewmustain-commits/safetyassuranceglobal-site`
- Working branch confirmed: `website/public-site-full-refresh`
- No direct commit to `main` performed in this phase
- No merge to production performed in this phase
- Build output mode confirmed: Astro static output to `dist`

## Required Baseline Commands and Results

1. `npm ci`
- Result: success
- Observations: 8 vulnerabilities reported by npm audit (5 moderate, 3 high)

2. `npm run check`
- Result: success (0 errors)
- Observations:
  - 13 hints reported
  - 12 deprecation hints in `src/content.config.ts` for `z` usage
  - 1 unused interface hint in `src/components/ui/Container.astro`

3. `npm run blog:validate`
- Result: success
- Observations: 4/4 blog posts passed validator

4. `npm run build`
- Result: success
- Observations:
  - Output mode: `static`
  - Output directory: `dist`
  - 15 pages built

## Repository Inventory Summary

- Routes/pages: 15 generated routes in current build
- Layouts: 1 (`src/layouts/BaseLayout.astro`)
- Components:
  - Brand: 1
  - Home sections: 7
  - UI primitives: 5
- Styles: 1 primary system stylesheet (`src/styles/design-system.css`)
- Content collections:
  - Config: `src/content.config.ts`
  - Blog content source: `src/content/blog/*.md`
- Blog posts:
  - Approved: 3
  - Draft (excluded from public routes): 1
- Forms:
  - No HTML form implementation detected on public routes
  - Contact flow relies on mailto links
- Images/static assets:
  - Brand and favicon assets in `public/images/brand` and `public`
- Scripts:
  - `scripts/blog-validate.mjs`
  - `scripts/validate-blog-status.mjs`
- Redirects/headers files:
  - No repository-level `_redirects` file found
  - No repository-level `_headers` file found
- Metadata utilities:
  - Metadata handled in `BaseLayout.astro`
  - No separate metadata utility module detected
- Structured-data utilities:
  - Organization JSON-LD in `BaseLayout.astro`
  - Additional inline JSON-LD appears inside one markdown post
  - No centralized structured-data utility module detected
- GitHub Actions:
  - `.github/workflows/build-validation.yml`
  - `.github/workflows/pr-build.yml`
  - `.github/workflows/codeql.yml`
- Cloudflare-specific files:
  - No `wrangler.toml` or explicit Cloudflare configuration file in repo
- Environment variable references:
  - No `process.env` or `import.meta.env` usage detected in site source/scripts/workflows
- Dependencies:
  - Runtime: `astro`
  - Dev: `typescript`, `@types/node`, `@astrojs/check`
- Validation scripts:
  - Blog validation is implemented and passing

## Current Route Map (Built)

- `/`
- `/about`
- `/academy`
- `/blog`
- `/blog/infrastructure-of-integrity-risk-governance`
- `/blog/measuring-assurance-framework-performance`
- `/blog/public-site-launch`
- `/command`
- `/contact`
- `/industries`
- `/privacy-policy`
- `/services`
- `/terms`
- `/terms-of-use`
- `/training`

## Route Inventory Records

| Route | Page Name | Purpose | Primary Audience | Current CTA | Recommended CTA | Content Status | Accuracy Concerns | UX Concerns | SEO Concerns | Accessibility Concerns | Broken Links | Claim Concerns | Recommended Disposition |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Home | Brand/offer overview and cross-navigation | Executives, operations leaders | Book a consultation | Request a Consultation | Active | Uses "command center" framing inconsistent with independent-assurance positioning | Dense cross-promotion of Academy/Command before core maritime narrative | Missing maritime-focused primary keyword targeting in title/hero | No critical defects observed in static audit | None detected in source-to-build validation | Implies software-command positioning | Rewrite |
| `/about` | About | Company mission and approach | Prospective clients | Explore Services / Contact Us | Request a Consultation | Active | Positioning is broad and not clearly maritime-first | Long page with asset-heavy brand section before commercial proof points | Limited maritime and critical-infrastructure specificity | No critical defects observed in static audit | None detected | Low direct claim risk | Rewrite |
| `/services` | Services | Service areas and process overview | Buyers, procurement, ops leaders | Request a Consultation | Request a Consultation | Active | Includes "Integration with SAG Command" and Academy coupling not aligned to strict system boundary messaging | High section count, some duplicative CTA buttons | Lacks dedicated service-detail routes required by target IA | No critical defects observed in static audit | None detected | Product availability implication risk | Rewrite |
| `/industries` | Industries | Industry applicability overview | Industry leaders | Explore Services / Contact Us | Request a Consultation | Active | Industry list is broad and not centered on maritime priority stack | Generic cards; limited depth per sector | Lacks dedicated industry child routes in target IA | No critical defects observed in static audit | None detected | Government support claims need qualification | Rewrite |
| `/training` | Training | High-level training page | Workforce leaders | None prominent beyond content cards | Request a Consultation | Thin | Sparse page, no concrete pathways or conversion hierarchy | Thin content and low conversion path | Thin content may underperform | No critical defects observed in static audit | None detected | Generic training claims only | Consolidate |
| `/academy` | Academy | Academy program marketing | L&D leaders, team leads | Explore Programs / Contact Us | Request a Consultation | Active | Positions SAG significantly as academy/training platform | Multiple repeated CTAs and overlap with `/training` | Potential keyword cannibalization with `/training` | No critical defects observed in static audit | None detected | Capability claims need evidence controls | Consolidate |
| `/command` | SAG Command | Product/platform-style marketing | Enterprise ops leaders | Request a Demonstration | Request a Consultation | Active | Strong software/platform positioning conflicts with controlling market position for this phase | Many sections, high cognitive load | Route may compete with core consulting value proposition | No critical defects observed in static audit | None detected | Material availability and capability claims require substantiation | Hold |
| `/contact` | Contact | Inquiry entry point | All prospects | Start an Inquiry / Email the Team | Request a Consultation | Active | No structured intake form; pathway descriptions may over-segment early-stage users | Mailto-only conversion path can reduce completion and tracking | Minimal localized metadata for conversions | No critical defects observed in static audit | None detected | Government/infrastructure path should be qualified | Rewrite |
| `/blog` | Blog Index | Public insights listing | Prospects, industry readers | Read article links | Request a Consultation | Active | Includes approved-post labeling but no claim-risk flagging for high-risk article | Featured and grid experience is acceptable | Missing taxonomy routes (`category`, `tag`) required by target IA | No critical defects observed in static audit | None detected | One linked article contains multiple unsupported/high-risk claims | Rewrite |
| `/blog/infrastructure-of-integrity-risk-governance` | Insight detail | Thought leadership article | Executives, gov/infrastructure readers | Type 3 assessment scheduling language in post body | Request a Consultation | Active high-risk | Contains numerous unsupported or unverified claims and internal terminology that appears non-publicly substantiated | Very long, mixed promotional/legal language | External image hosting and metadata inconsistency | Potential content complexity and contrast review needed after rewrite | No internal route breaks; external CDN assets present | High concentration of unsupported and executive-confirmation-required claims | Hold |
| `/blog/measuring-assurance-framework-performance` | Insight detail | Practical assurance article | Safety/risk practitioners | Back to blog | Request a Consultation | Active | Low-risk educational content | CTA opportunity is weak | Could improve schema and cross-linking to service pages | No critical defects observed in static audit | None detected | Low claim risk | Retain |
| `/blog/public-site-launch` | Insight detail | Site launch announcement | General audience | Back to blog | Request a Consultation | Active | Low factual risk but dated announcement style | Minimal depth/value for evergreen insights | Limited long-tail SEO value | No critical defects observed in static audit | None detected | Low claim risk | Retain |
| `/privacy-policy` | Legal | Privacy terms | All visitors | None | None | Active | Generic policy language, may require legal validation by counsel | Minimal structure, no last-updated indicator | Legal pages not optimized for trust snippets | No critical defects observed in static audit | None detected | Legal assertions require counsel confirmation | Rewrite |
| `/terms-of-use` | Legal | Terms of use | All visitors | None | None | Active | Generic and high-level; likely requires legal hardening | Duplication risk with `/terms` | Duplicate/overlap route can split indexation | No critical defects observed in static audit | None detected | Legal assertions require counsel confirmation | Retain |
| `/terms` | Legal duplicate | Short terms page duplicate | All visitors | None | None | Active duplicate | Conflicts with `/terms-of-use` as overlapping legal endpoint | Thin duplicate content | Duplicate legal page can dilute canonical intent | No critical defects observed in static audit | None detected | Low claim risk, but legal duplication risk | Redirect |

## Route Integrity Snapshot

- Internal href targets resolved against current built routes and public assets: no broken internal links detected
- Missing routes relative to target IA are tracked in `docs/website/INFORMATION-ARCHITECTURE.md`

## Phase 1 Constraints Confirmation

- No substantial public page rewrite performed in this phase
- Inventory and risk documentation only
