import fs from 'node:fs';

const path = 'workers/inquiry-delivery/src/index.ts';
const source = fs.readFileSync(path, 'utf8');
const required = [
  "const MAX_BODY_BYTES = 16_384;",
  "const MAX_AGE_MS = 10 * 60 * 1000;",
  "const MAX_FUTURE_SKEW_MS = 2 * 60 * 1000;",
  "https://safetyassuranceglobal.com",
  "https://www.safetyassuranceglobal.com",
  "if (!isAllowedOrigin(request))",
  "request.headers.get('sec-fetch-site')",
  "if (!isFreshSubmission(payload.submittedAt))"
];
for (const marker of required) {
  if (!source.includes(marker)) throw new Error(`Inquiry hardening marker missing: ${marker}`);
}

const consoleCalls = [...source.matchAll(/console\.(log|info|warn|error|debug)\s*\(([\s\S]*?)\);/g)].map((match) => match[0]);
const allowedTelemetry = /^console\.error\('Inquiry email delivery failed',\s*\{\s*code,\s*formType,\s*occurredAt:\s*new Date\(\)\.toISOString\(\)\s*\}\);$/s;
for (const call of consoleCalls) {
  if (!allowedTelemetry.test(call)) {
    throw new Error(`Unapproved console telemetry in inquiry worker: ${call.replace(/\s+/g, ' ')}`);
  }
}
if (consoleCalls.length !== 1) {
  throw new Error(`Expected exactly one approved inquiry-worker console telemetry call; found ${consoleCalls.length}.`);
}

console.log('Inquiry hardening validation passed.');
