import fs from 'node:fs';

const registerPath = 'docs/website/PUBLIC-CLAIMS-REGISTER.md';
const text = fs.readFileSync(registerPath, 'utf8');
const failures = [];

for (const marker of [
  'Status: Current-source reconciliation',
  '## Current Material Public Claims',
  '## Release Rule',
  '## Institute Boundary'
]) {
  if (!text.includes(marker)) failures.push(`claims register missing required control: ${marker}`);
}

const currentSection = text.split('## Current Material Public Claims')[1]?.split('## Reconciled Historical Items')[0] ?? '';

const protectedRows = [
  {
    label: 'government qualification status',
    claim: 'Government-ready',
    disposition: 'Hold — current evidence required before amplification or material reuse'
  },
  {
    label: 'government identifiers',
    claim: 'UEI RCUUJLWEBGD4; CAGE 16NM4; NAICS 541611',
    disposition: 'Hold — current evidence required before material change or reuse'
  },
  {
    label: 'Institute authority boundary',
    claim: 'Institute of Assurance as Safety Assurance Global’s professional education and assurance-learning institution',
    disposition: 'Qualified'
  },
  {
    label: 'SAG Command production capability',
    claim: 'SAG Command availability or integrated operational platform capability',
    disposition: 'Hold — evidence required'
  }
];

for (const protectedRow of protectedRows) {
  const row = currentSection
    .split('\n')
    .find((line) => line.startsWith('|') && line.includes(protectedRow.claim));

  if (!row) {
    failures.push(`claims register missing protected row: ${protectedRow.label}`);
    continue;
  }

  const cells = row.split('|').map((cell) => cell.trim()).filter(Boolean);
  if (!cells.includes(protectedRow.disposition)) {
    failures.push(`protected row has unexpected disposition: ${protectedRow.label}`);
  }
}

if (/\|\s*Unsupported\s*\|/i.test(currentSection)) {
  failures.push('current claims table uses legacy Unsupported status; reconcile to a controlled current disposition');
}

if (failures.length) {
  console.error('Public claims governance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Public claims governance validation passed.');
