import fs from 'node:fs';
import { createHash } from 'node:crypto';

const failures = [];
const read = (path) => fs.readFileSync(path, 'utf8');
const requireText = (source, marker, message) => {
  if (!source.includes(marker)) failures.push(message);
};

const accessibility = read('src/styles/accessibility.css');
const assistant = read('src/components/ui/SiteAssistant.astro');
const intake = read('public/scripts/intake-form.js');
const contact = read('src/components/forms/ContactInquiryForm.astro');
const proposal = read('src/components/forms/ProposalRequestForm.astro');
const contactPage = read('src/pages/contact.astro');
const proposalPage = read('src/pages/request-proposal.astro');
const server = read('functions/api/inquiry.ts');
const headers = read('public/_headers');
const brand = read('src/config/brand-assets.ts');
const proof = read('src/pages/proof.astro');
const completed = read('src/pages/completed-example.astro');
const government = read('src/pages/government.astro');
const capabilities = read('src/pages/capabilities.astro');
const layout = read('src/layouts/BaseLayout.astro');
const astroConfig = read('astro.config.mjs');
const category = read('src/pages/insights/category/[category].astro');
const tag = read('src/pages/insights/tag/[tag].astro');
const institute = read('src/pages/institute.astro');
const training = read('src/pages/training.astro');
const measurement = read('public/scripts/site-measurement.js');
const scopeRuntime = read('public/scripts/scope-builder.js');
const readinessRuntime = read('public/scripts/readiness-check.js');
const startPage = read('src/pages/start.astro');
const readinessPage = read('src/pages/readiness-check.astro');
const home = read('src/pages/index.astro');
const logo = read('src/components/brand/Logo.astro');
const designSystem = read('src/styles/design-system.css');

requireText(accessibility, '.primary-nav .mobile-nav-cta .ui-button', 'F01: mobile navigation CTA lacks explicit scoped style.');
requireText(accessibility, 'background: #f3b33d !important', 'F01: mobile navigation CTA lacks high-contrast background.');
requireText(accessibility, 'color: #07192a !important', 'F01: mobile navigation CTA lacks explicit contrasting foreground.');
requireText(accessibility, 'max-width: calc(100% - 5.6rem)', 'F02: mobile header does not reserve menu space.');

requireText(assistant, '@media(max-width:760px){.site-assistant{position:static', 'F03: mobile helper must become inline/static.');
if (/@media\(max-width:760px\)[\s\S]*?\.site-assistant\{[^}]*position:fixed/.test(assistant)) failures.push('F03: mobile helper reintroduces fixed positioning.');

for (const marker of ['validateSupportedLengths', 'FIELD_LIMITS', 'Your text is still intact']) {
  requireText(intake, marker, `F04: intake no-truncation control missing: ${marker}`);
}
if (/slice\(0,\s*MAX_MESSAGE_LENGTH\)/.test(intake) || intake.includes('truncateForMailto')) {
  failures.push('F04: silent buyer-text truncation is present.');
}
for (const source of [contact, proposal]) {
  requireText(source, 'data-max-length="3000"', 'F04: long-text field limit is not disclosed in form markup.');
  requireText(source, 'Your text is never silently shortened.', 'F04: no-truncation notice missing.');
}
for (const marker of ['message: 3_000', 'briefScope: 3_000', 'procurementContext: 3_000']) {
  requireText(server, marker, `F04: server/client long-text contract missing: ${marker}`);
}

for (const marker of ['buildFallbackText', 'downloadFallbackRequest', 'new Blob([rawBody]', 'handoffFallbackRequest', 'sag-proposal-request.txt']) {
  requireText(intake, marker, `F04: full-request fallback preservation missing: ${marker}`);
}
if (intake.includes('buildFallbackMailto') || intake.includes('body=${encodeURIComponent(rawBody)}')) {
  failures.push('F04: fallback still attempts to place the full buyer request in a mailto URI.');
}

requireText(headers, 'https://static.cloudflareinsights.com', 'F05: CSP does not allow Cloudflare analytics script.');
requireText(headers, 'https://cloudflareinsights.com', 'F05: CSP does not allow Cloudflare analytics collection.');
for (const forbidden of ['fetch(', 'XMLHttpRequest', 'navigator.sendBeacon', 'localStorage', 'sessionStorage']) {
  if (measurement.includes(forbidden)) failures.push(`F05: local funnel hook contains forbidden network/storage path: ${forbidden}`);
}

requireText(brand, "sagSeal: '/images/brand/image.png'", 'F06: production SAG seal is not using lightweight approved asset.');
const sealSize = fs.statSync('public/images/brand/image.png').size;
if (sealSize > 100_000) failures.push(`F06: production seal exceeds 100 KB budget (${sealSize} bytes).`);

for (const marker of ['Synthetic Demonstration', 'Observed condition', 'Supporting evidence', 'Corrective action', 'Closure evidence', 'Disposition']) {
  requireText(completed, marker, `F07: completed synthetic example missing: ${marker}`);
}
const completedEvidenceIds = new Set(completed.match(/DEMO-EV-\d+/g) ?? []);
if (completedEvidenceIds.size !== 11) failures.push(`F07: completed example currently exposes ${completedEvidenceIds.size} distinct evidence IDs; expected 11.`);
requireText(completed, 'const evidenceRecordCount = new Set(', 'F07: evidence-set count is not derived from the referenced synthetic evidence IDs.');
requireText(completed, '<strong>{evidenceRecordCount} synthetic records</strong>', 'F07: buyer-facing evidence count is not bound to the derived synthetic record count.');
if (/<strong>\d+ synthetic records<\/strong>/.test(completed)) failures.push('F07: buyer-facing synthetic evidence count is hard-coded and can drift from referenced IDs.');
requireText(proof, 'href="/completed-example"', 'F07: Proof Center does not expose completed example in one click.');

if (!(contactPage.indexOf('<ContactInquiryForm />') < contactPage.indexOf('contact-paths-title'))) {
  failures.push('F08: contact form is not positioned before explanatory path content.');
}
if (!(proposalPage.indexOf('<ProposalRequestForm />') < proposalPage.indexOf('proposal-ready-title'))) {
  failures.push('F08: proposal form is not positioned before explanatory proposal content.');
}
requireText(server, "contact: ['name', 'email', 'message', 'privacyAcknowledgement']", 'F08: short contact path is not aligned on the server.');
requireText(contactPage, 'Response timing:', 'F08: contact page lacks response-timing guidance.');
requireText(proposalPage, 'Response timing:', 'F08: proposal page lacks response-timing guidance.');

if (capabilities.includes('Port of Portland owner-representative safety') || capabilities.includes('Microsoft and Google')) {
  failures.push('F10: unattributed prior-employer experience list remains public.');
}
requireText(capabilities, 'Opportunity-specific experience is attributed before it is used.', 'F10: experience attribution rule missing.');

requireText(layout, "const canonicalPath=normalizedPath==='/'?'/':`${normalizedPath}/`", 'F11: canonical path does not match trailing-slash route policy.');
requireText(astroConfig, "trailingSlash: 'always'", 'F11: Astro trailing-slash policy is not explicit.');
requireText(layout, "defaultSocialImage='/images/brand/sag-maritime-hero-2026.jpeg'", 'F12: default raster social image missing.');
if (layout.includes("sag-social-share.svg")) failures.push('F12: SVG social fallback is still active.');

if (government.includes('dated August 2026 capabilities statement')) failures.push('F13: Government still cites the August statement.');
requireText(government, 'September 2026 public capability statement', 'F13: Government does not use the current public source revision.');
requireText(capabilities, 'Website source reconciliation: September 27, 2026', 'F13: capability source reconciliation date missing.');

requireText(category, 'noIndex={true}', 'F14: category archives are still indexable.');
requireText(tag, 'noIndex={true}', 'F14: tag archives are still indexable.');
requireText(astroConfig, "pathname.startsWith('/insights/category/')", 'F14: category archives remain in sitemap.');
requireText(astroConfig, "pathname.startsWith('/insights/tag/')", 'F14: tag archives remain in sitemap.');

requireText(institute, 'noIndex={true}', 'F15: corporate Institute gateway remains a competing indexable destination.');
requireText(institute, 'What You Can Do Today', 'F15: Institute handoff lacks plain current-action language.');
requireText(training, 'Current Buyer Path', 'F15: training page lacks plain current-action language.');


// Final re-audit R01 — changed public scripts are content-addressed in rendered HTML.
// Stable source filenames remain repository authoring inputs only; public HTML must point at fingerprinted copies.
const releaseScripts = [
  [contact, '/scripts/intake-form.9c71f918392c.js', 'public/scripts/intake-form.js', 'public/scripts/intake-form.9c71f918392c.js', 'contact intake'],
  [proposal, '/scripts/intake-form.9c71f918392c.js', 'public/scripts/intake-form.js', 'public/scripts/intake-form.9c71f918392c.js', 'proposal intake'],
  [proposal, '/scripts/proposal-prefill.764102aac31a.js', 'public/scripts/proposal-prefill.js', 'public/scripts/proposal-prefill.764102aac31a.js', 'proposal prefill'],
  [startPage, '/scripts/scope-builder.f007161d5676.js', 'public/scripts/scope-builder.js', 'public/scripts/scope-builder.f007161d5676.js', 'scope builder'],
  [readinessPage, '/scripts/readiness-check.7c1209a7c75e.js', 'public/scripts/readiness-check.js', 'public/scripts/readiness-check.7c1209a7c75e.js', 'readiness snapshot'],
  [layout, '/scripts/site-measurement.11122ffd15b8.js', 'public/scripts/site-measurement.js', 'public/scripts/site-measurement.11122ffd15b8.js', 'site measurement']
];
const gitBlobSha = (content) =>
  createHash('sha1')
    .update(`blob ${Buffer.byteLength(content, 'utf8')}\0`)
    .update(content)
    .digest('hex');

for (const [source, markerText, canonicalPath, fingerprintPath, label] of releaseScripts) {
  requireText(source, markerText, `R01: ${label} HTML reference is not content-fingerprinted.`);
  if (!fs.existsSync(fingerprintPath)) {
    failures.push(`R01: ${label} fingerprinted asset is missing: ${fingerprintPath}`);
    continue;
  }

  const canonical = read(canonicalPath);
  const fingerprinted = read(fingerprintPath);
  if (canonical !== fingerprinted) failures.push(`R01: ${label} fingerprinted asset drifted from its canonical source.`);

  const suffix = fingerprintPath.match(/\.([0-9a-f]{12})\.js$/)?.[1];
  const expectedSuffix = gitBlobSha(canonical).slice(0, 12);
  if (!suffix || suffix !== expectedSuffix) {
    failures.push(`R01: ${label} filename fingerprint ${suffix ?? '(missing)'} does not match canonical Git blob hash prefix ${expectedSuffix}.`);
  }
}

// Final re-audit R02 — changed inputs must invalidate prior interactive results.
for (const [source, label, statusMarker] of [
  [scopeRuntime, 'scope builder', 'data-scope-stale-status'],
  [readinessRuntime, 'readiness snapshot', 'data-readiness-stale-status']
]) {
  requireText(source, 'invalidateResult', `R02: ${label} lacks a shared stale-result invalidation path.`);
  requireText(source, "addEventListener('change'", `R02: ${label} does not invalidate output when answers change.`);
  requireText(source, "addEventListener('pageshow'", `R02: ${label} does not guard browser-history restoration.`);
  const page = label === 'scope builder' ? startPage : readinessPage;
  requireText(page, statusMarker, `R02: ${label} lacks an accessible stale-result announcement region.`);
}

// Final re-audit R03 — beginner path must not require assurance taxonomy knowledge.
requireText(layout, "{ href: '/contact', label: 'Contact' }", 'R03: Contact is not exposed in primary navigation.');
requireText(home, 'Tell Us What You Need', 'R03: homepage does not expose the short-contact path as the primary action.');
requireText(home, 'See an Example Report', 'R03: homepage lacks one-click completed example action.');
requireText(home, 'Help Me Define the Work', 'R03: guided scope is not presented as the optional alternative.');
if ((startPage.match(/'Not Sure Yet'/g) ?? []).length < 2) failures.push('R03: scope builder must offer Not Sure Yet for both assurance need and desired output.');
if (!(layout.indexOf('<SiteAssistant />') < layout.indexOf('<main id="main-content"'))) failures.push('R03: mobile customer help is not placed near the top of the document flow.');

// Customer value extension — generated result briefs stay local until the visitor chooses a next step.
for (const [page, runtime, label, pageMarker, filename] of [
  [startPage, scopeRuntime, 'scope builder', 'data-scope-download', 'safety-assurance-global-preliminary-scope.txt'],
  [readinessPage, readinessRuntime, 'readiness snapshot', 'data-readiness-download', 'safety-assurance-global-readiness-snapshot.txt']
]) {
  requireText(page, pageMarker, `Customer result export missing from ${label} page.`);
  requireText(runtime, 'downloadTextFile', `Customer result export helper missing from ${label} runtime.`);
  requireText(runtime, filename, `Customer result export filename missing from ${label} runtime.`);
  requireText(runtime, "name: 'resource_download'", `Privacy-safe result-download measurement event missing from ${label} runtime.`);
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'navigator.sendBeacon', 'localStorage', 'sessionStorage']) {
    if (runtime.includes(forbidden)) failures.push(`Customer result export for ${label} must remain browser-local; forbidden behavior found: ${forbidden}`);
  }
}

// Final re-audit R04 — compact lockup and single desktop navigation treatment.
requireText(layout, 'className="brand header-brand"', 'R04: shared header is not using the compact brand lockup.');
requireText(logo, "'is-header': isHeader", 'R04: Logo component lacks compact header state.');
requireText(accessibility, 'overflow: visible', 'R04: mobile brand can still be clipped by overflow.');
requireText(accessibility, '@media (min-width: 921px)', 'R04: desktop header lacks an explicit single-navigation treatment.');
requireText(accessibility, '.site-header .nav-toggle { display: none !important; }', 'R04: desktop Menu control is not explicitly hidden with sufficient selector specificity.');
requireText(designSystem, 'min-height:min(84svh,52rem)', 'R04: homepage hero has not been tightened for ordinary laptop first-screen action visibility.');

if (failures.length) {
  console.error('September 27 website-audit remediation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`September 27 website-audit remediation validation passed. Production seal: ${sealSize} bytes.`);
