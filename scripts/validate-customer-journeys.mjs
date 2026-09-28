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

for (const href of ['/start', '/proof', '/resources', '/readiness-check']) requireLink('/', href);
for (const href of ['/sample-deliverables', '/service-sheets', '/method', '/capabilities', '/engagement-examples', '/leadership']) requireLink('/proof', href);
for (const href of ['/partners', '/resources', '/capabilities']) requireLink('/government', href);
for (const href of ['/readiness-check', '/start', '/sample-deliverables', '/service-sheets']) requireLink('/resources', href);

const start = pages['/start'];
for (const marker of ['data-scope-builder', 'Build Preliminary Scope', 'Continue to Proposal Request']) {
  if (!start.includes(marker)) failures.push(`/start: missing governed scope-builder marker: ${marker}`);
}

const readiness = pages['/readiness-check'];
for (const marker of ['data-readiness-assessment', 'Show My Snapshot', 'informational self-assessment']) {
  if (!readiness.includes(marker)) failures.push(`/readiness-check: missing governed readiness marker: ${marker}`);
}
if (/Snapshot index:\s*\d+%/i.test(readiness)) failures.push('/readiness-check: numeric pseudo-precision reintroduced');

const proposal = pages['/request-proposal'];
if (!proposal.includes('/scripts/proposal-prefill.js')) failures.push('/request-proposal: scope carry-forward script missing');

const home = pages['/'];
if (!home.includes('Need help choosing?')) failures.push('/: persistent customer pathfinder trigger missing');

const measurement = fs.readFileSync('public/scripts/site-measurement.js', 'utf8');
for (const eventName of [
  'scope_view',
  'proof_view',
  'resources_view',
  'readiness_view',
  'partners_view',
  'engagement_examples_view',
  'leadership_view',
  'scope_builder_complete',
  'readiness_snapshot_complete',
  'resource_download'
]) {
  if (!measurement.includes(`'${eventName}'`)) failures.push(`measurement allowlist missing customer event: ${eventName}`);
}

if (failures.length) {
  console.error('Customer journey validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Customer journey validation passed: buyer routes, cross-links, guided scope, readiness boundaries, proposal carry-forward, persistent pathfinder, and privacy-safe journey events are intact.');
