import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const failures = [];

const routeFile = (route) => {
  const normalized = route.replace(/^\/+|\/+$/g, '');
  return normalized ? path.join(dist, normalized, 'index.html') : path.join(dist, 'index.html');
};

const readRoute = (route) => {
  const file = routeFile(route);
  if (!fs.existsSync(file)) {
    failures.push(`required customer route missing: ${route}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
};

const requiredRoutes = [
  '/',
  '/start',
  '/proof',
  '/completed-example',
  '/resources',
  '/readiness-check',
  '/partners',
  '/engagement-examples',
  '/leadership',
  '/government',
  '/request-proposal'
];

const pages = Object.fromEntries(requiredRoutes.map((route) => [route, readRoute(route)]));

const requireLink = (route, href) => {
  const html = pages[route] ?? readRoute(route);
  const encoded = href.replace(/&/g, '&amp;');
  if (!html.includes(`href="${href}"`) && !html.includes(`href="${encoded}"`)) {
    failures.push(`${route}: required customer-journey link missing: ${href}`);
  }
};

const requireLinkPrefix = (route, hrefPrefix) => {
  const html = pages[route] ?? readRoute(route);
  const encoded = hrefPrefix.replace(/&/g, '&amp;');
  if (!html.includes(`href="${hrefPrefix}`) && !html.includes(`href="${encoded}`)) {
    failures.push(`${route}: required customer-journey link prefix missing: ${hrefPrefix}`);
  }
};

for (const href of ['/start', '/proof', '/resources', '/readiness-check']) requireLink('/', href);
for (const href of ['/completed-example', '/sample-deliverables', '/service-sheets', '/method', '/capabilities', '/engagement-examples', '/leadership']) requireLink('/proof', href);
for (const href of ['/partners', '/resources', '/capabilities']) requireLink('/government', href);
for (const href of ['/completed-example', '/readiness-check', '/start', '/sample-deliverables', '/service-sheets', '/request-proposal']) requireLink('/resources', href);
for (const href of ['/start', '/proof']) requireLink('/engagement-examples', href);
for (const href of ['/start', '/partners', '/request-proposal', '/capabilities']) requireLink('/leadership', href);
for (const href of ['/proof']) requireLink('/partners', href);
requireLinkPrefix('/partners', '/request-proposal?');

const start = pages['/start'];
for (const marker of ['data-scope-builder', 'Build Preliminary Scope', 'Continue to Proposal Request']) {
  if (!start.includes(marker)) failures.push(`/start: missing governed scope-builder marker: ${marker}`);
}
if (/<input\b|<textarea\b/i.test(start)) {
  failures.push('/start: scope builder must remain selection-only and must not collect personal or project-sensitive free text');
}

const scopeRuntime = fs.readFileSync('public/scripts/scope-builder.js', 'utf8');
for (const forbidden of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'navigator.sendBeacon']) {
  if (scopeRuntime.includes(forbidden)) failures.push(`scope builder contains forbidden persistence/network behavior: ${forbidden}`);
}
for (const marker of ['invalidateResult', "form.addEventListener('change'", "window.addEventListener('pageshow'"]) {
  if (!scopeRuntime.includes(marker)) failures.push(`scope builder stale-result control missing: ${marker}`);
}
if (!start.includes('data-scope-stale-status')) failures.push('/start: accessible stale-result status region missing');
if ((start.match(/Not Sure Yet/g) ?? []).length < 2) failures.push('/start: novice Not Sure Yet choices must exist for need and outcome');

const readiness = pages['/readiness-check'];
for (const marker of ['data-readiness-assessment', 'Show My Snapshot', 'informational self-assessment', 'data-readiness-scope-link']) {
  if (!readiness.includes(marker)) failures.push(`/readiness-check: missing governed readiness marker: ${marker}`);
}

const readinessRuntime = fs.readFileSync('public/scripts/readiness-check.js', 'utf8');
for (const marker of ['Evidence visible', 'Partially visible', 'Material gaps', 'Not yet verified', 'focusNeedByDomain', 'data-readiness-scope-link', '/start?need=']) {
  if (!readinessRuntime.includes(marker)) failures.push(`readiness runtime missing qualitative routing control: ${marker}`);
}
for (const forbidden of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'navigator.sendBeacon']) {
  if (readinessRuntime.includes(forbidden)) failures.push(`readiness snapshot contains forbidden persistence/network behavior: ${forbidden}`);
}
for (const marker of ['invalidateResult', "form.addEventListener('change'", "window.addEventListener('pageshow'"]) {
  if (!readinessRuntime.includes(marker)) failures.push(`readiness snapshot stale-result control missing: ${marker}`);
}
if (!readiness.includes('data-readiness-stale-status')) failures.push('/readiness-check: accessible stale-result status region missing');
if (readinessRuntime.includes('%') || /\b(?:score|rating|percentile|percentage|index)\b/i.test(readinessRuntime)) {
  failures.push('/readiness-check: runtime numeric pseudo-precision or scoring language reintroduced');
}

for (const sourcePath of [
  'src/data/services.ts',
  'src/data/industries.ts',
  'src/pages/method.astro',
  'src/pages/maritime.astro'
]) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  if (/readiness\s+score(?:card)?/i.test(source)) {
    failures.push(`${sourcePath}: qualitative readiness policy violated by score/scorecard language`);
  }
}

const proposal = pages['/request-proposal'];
if (!proposal.includes('/scripts/proposal-prefill.764102aac31a.js')) failures.push('/request-proposal: fingerprinted scope carry-forward script missing');
if (!proposal.includes('data-prefill-status')) failures.push('/request-proposal: persistent scope carry-forward notice missing');
for (const [html, asset] of [
  [pages['/start'], '/scripts/scope-builder.f007161d5676.js'],
  [pages['/readiness-check'], '/scripts/readiness-check.7c1209a7c75e.js'],
  [pages['/request-proposal'], '/scripts/intake-form.9c71f918392c.js']
]) {
  if (!html.includes(asset)) failures.push(`fingerprinted release asset reference missing: ${asset}`);
}

const prefillRuntime = fs.readFileSync('public/scripts/proposal-prefill.js', 'utf8');
for (const marker of [
  "form.dataset.prefillApplied = 'true'",
  "form.querySelector('[data-prefill-status]')",
  'Preliminary scope details were carried forward. Review and edit them before submitting.'
]) {
  if (!prefillRuntime.includes(marker)) failures.push(`proposal prefill runtime missing persistence marker: ${marker}`);
}

const home = pages['/'];
for (const marker of ['Tell Us What You Need', 'See an Example Report', 'Help Me Define the Work']) {
  if (!home.includes(marker)) failures.push(`/: beginner hero action missing: ${marker}`);
}
if (!home.includes('Need help choosing?')) failures.push('/: persistent customer pathfinder trigger missing');
for (const href of ['/start', '/resources', '/proof', '/government', '/partners', '/request-proposal', '/contact']) requireLink('/', href);
if (!home.includes('href="https://institute.safetyassuranceglobal.com"')) {
  failures.push('/: persistent customer pathfinder Institute route missing');
}

const measurement = fs.readFileSync('public/scripts/site-measurement.js', 'utf8');
const expectedEvents = [
  'service_view',
  'capability_view',
  'government_view',
  'scope_view',
  'proof_view',
  'resources_view',
  'readiness_view',
  'partners_view',
  'engagement_examples_view',
  'leadership_view',
  'scope_builder_complete',
  'readiness_snapshot_complete',
  'resource_download',
  'contact_start',
  'inquiry_start',
  'inquiry_success',
  'proposal_start',
  'proposal_success',
  'capability_statement_download',
  'assistant_open',
  'assistant_handoff'
];

const allowlistMatch = measurement.match(/const allowedEvents = new Set\(\[([\s\S]*?)\]\);/);
if (!allowlistMatch) {
  failures.push('measurement allowlist declaration missing');
} else {
  const actualEvents = [...allowlistMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const expectedSorted = [...expectedEvents].sort();
  const actualSorted = [...new Set(actualEvents)].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(`measurement allowlist drift: expected ${expectedSorted.join(', ')}; found ${actualSorted.join(', ')}`);
  }
  if (actualEvents.length !== actualSorted.length) failures.push('measurement allowlist contains duplicate events');
}

const viewMappings = [
  ['/government', 'government_view'],
  ['/start', 'scope_view'],
  ['/proof', 'proof_view'],
  ['/resources', 'resources_view'],
  ['/readiness-check', 'readiness_view'],
  ['/partners', 'partners_view'],
  ['/engagement-examples', 'engagement_examples_view'],
  ['/leadership', 'leadership_view']
];
for (const [route, eventName] of viewMappings) {
  const marker = `if (path === '${route}') emit('${eventName}')`;
  if (!measurement.includes(marker)) failures.push(`measurement route mapping missing: ${route} -> ${eventName}`);
}

if (failures.length) {
  console.error('Customer journey validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Customer journey validation passed: buyer routes, cross-links, browser-only guided tools, qualitative readiness boundaries, persistent proposal carry-forward, customer pathfinder, and exact privacy-safe measurement contracts are intact.');
