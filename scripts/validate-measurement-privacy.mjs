import fs from 'node:fs';

const measurement = fs.readFileSync('public/scripts/site-measurement.js', 'utf8');
const scopeBuilder = fs.readFileSync('public/scripts/scope-builder.js', 'utf8');
const readiness = fs.readFileSync('public/scripts/readiness-check.js', 'utf8');
const failures = [];

const requiredMeasurementMarkers = [
  "new CustomEvent('sag:measurement', { detail: { name } })",
  "window.addEventListener('sag:site-event'",
  "document.addEventListener('sag:intake-event'"
];

for (const marker of requiredMeasurementMarkers) {
  if (!measurement.includes(marker)) failures.push(`measurement runtime missing privacy control: ${marker}`);
}

const forbiddenMeasurementMarkers = [
  'FormData(',
  'localStorage',
  'sessionStorage',
  'XMLHttpRequest',
  'navigator.sendBeacon',
  'fetch(',
  'email:',
  'message:',
  'briefScope:',
  'procurementContext:',
  'turnstileToken:',
  'userAgent:'
];

for (const marker of forbiddenMeasurementMarkers) {
  if (measurement.includes(marker)) failures.push(`measurement runtime contains forbidden data/network marker: ${marker}`);
}

for (const [label, source, eventName] of [
  ['scope builder', scopeBuilder, 'scope_builder_complete'],
  ['readiness snapshot', readiness, 'readiness_snapshot_complete']
]) {
  const expected = `new CustomEvent('sag:site-event', { detail: { name: '${eventName}' } })`;
  if (!source.includes(expected)) failures.push(`${label} does not emit the approved event-name-only completion marker`);
}

const siteEventDetailPattern = /new CustomEvent\('sag:site-event',\s*\{\s*detail:\s*\{\s*name:\s*'[^']+'\s*\}\s*\}\)/g;
for (const [label, source] of [['scope builder', scopeBuilder], ['readiness snapshot', readiness]]) {
  const eventCalls = source.match(/new CustomEvent\('sag:site-event'[\s\S]*?\)\)/g) ?? [];
  for (const call of eventCalls) {
    if (!siteEventDetailPattern.test(call)) failures.push(`${label} site-event payload is not name-only`);
    siteEventDetailPattern.lastIndex = 0;
  }
}

if (failures.length) {
  console.error('Measurement privacy validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Measurement privacy validation passed: measurement remains event-name-only with no form, tool-answer, storage, or network payload path.');
