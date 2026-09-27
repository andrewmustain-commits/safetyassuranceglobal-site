import fs from 'node:fs';

const registerPath = 'docs/website/PUBLIC-CLAIMS-REGISTER.md';
const text = fs.readFileSync(registerPath, 'utf8');
const failures = [];

for (const marker of [
  'Date: 2026-09-27',
  'Status: Current-source reconciliation',
  '## Current Material Public Claims',
  '## Release Rule',
  '## Institute Boundary',
  'Hold — current evidence required before amplification or material reuse'
]) {
  if (!text.includes(marker)) failures.push(`claims register missing required control: ${marker}`);
}

const currentSection = text.split('## Current Material Public Claims')[1]?.split('## Reconciled Historical Items')[0] ?? '';
if (/\|\s*Unsupported\s*\|/i.test(currentSection)) {
  failures.push('current claims table uses legacy Unsupported status; reconcile to a controlled current disposition');
}

if (failures.length) {
  console.error('Public claims governance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Public claims governance validation passed.');
