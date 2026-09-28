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
    claim: 'Safety Assurance Global Institute of Assurance as a professional-education and assurance-learning institution associated with the Safety Assurance Global ecosystem',
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

function collectSourceText(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  let combined = '';
  for (const entry of entries) {
    const entryPath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      combined += collectSourceText(entryPath);
    } else if (entry.isFile() && /\.(astro|ts|js|mjs|md)$/i.test(entry.name)) {
      combined += `\n${entryPath}\n${fs.readFileSync(entryPath, 'utf8')}`;
    }
  }
  return combined;
}

const sourceText = collectSourceText('src');
const forbiddenInstituteRelationshipClaims = [
  /learning and workforce-development division/i,
  /Safety Assurance Global[’']s professional education and assurance-learning institution/i,
  /governed professional-education and workforce-development institution associated with the Safety Assurance Global ecosystem/i,
  /One destination for governed professional learning/i,
  /offerings governed through the Safety Assurance Global Institute of Assurance/i
];

for (const pattern of forbiddenInstituteRelationshipClaims) {
  if (pattern.test(sourceText)) {
    failures.push(`public source contains an Institute relationship/governance claim outside the verified association boundary: ${pattern}`);
  }
}

if (failures.length) {
  console.error('Public claims governance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Public claims governance validation passed.');
