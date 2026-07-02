# Website Validation Report (HARDEN-002)

Date: 2026-07-02
Scope: Website audit of Astro pages, navigation, layout consistency, blog rendering, internal links, and responsive baseline.

## Pages Inspected
- src/pages/index.astro
- src/pages/about.astro
- src/pages/services.astro
- src/pages/industries.astro
- src/pages/academy.astro
- src/pages/command.astro
- src/pages/training.astro
- src/pages/contact.astro
- src/pages/blog/index.astro
- src/pages/blog/[slug].astro
- src/pages/privacy-policy.astro
- src/pages/terms-of-use.astro
- src/pages/terms.astro

## Findings

### 1) Header/Footer/Layout Consistency
Status: Pass
- All inspected pages use shared BaseLayout.
- Shared header, footer, breadcrumb, and skip link are consistently rendered.
- Primary nav links are consistent with route structure.

### 2) Navigation and Homepage Linking
Status: Partial pass
- Core route links resolve to existing pages.
- Home page includes expected section links and blog preview links.
- Policy links in footer include Privacy Policy and Terms of Use.

Observation:
- A separate Terms page exists at /terms but is not linked from header/footer.

### 3) Blog Rendering
Status: Pass
- Blog index renders approved-only posts.
- Blog detail routes are generated from approved-only posts.
- Draft post exists in collection but is excluded from public listing/path generation.

### 4) Internal Anchor Integrity
Status: Fail (identified defects)
Confirmed in built HTML output:
- /academy uses href="#program-areas", but id="program-areas" is missing.
- /contact uses href="#contact-pathways", but id="contact-pathways" is missing.
- /services uses href="/services#sag-command", but id="sag-command" is missing.

Root cause:
- Shared UI wrapper components do not forward arbitrary attributes (for example id) to rendered HTML elements, so ids passed in page usage are not emitted.

### 5) Responsive Layout Baseline
Status: Pass (source-level)
- Global breakpoints at 900px and 720px are present.
- Mobile nav toggle behavior is implemented.
- Page/component-specific breakpoints are present across major page modules.

## Risks
1. Broken in-page navigation reduces usability and trust.
2. CTA links pointing to missing anchors can degrade conversion flow.
3. Unlinked /terms route may create policy discoverability inconsistency.

## Recommendations
1. Update shared components to forward passthrough attributes (id and other valid attributes).
2. Revalidate all hash/anchor links after id forwarding fix.
3. Decide policy routing strategy for /terms versus /terms-of-use and make links explicit.
4. Keep approved-only blog route filtering as-is.

## Validation Evidence
- Build succeeded (14 pages).
- Dist inspection confirmed anchor references exist while target ids are missing.
