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
  "if (!isFreshSubmission(payload.submittedAt))",
  "console.error('Inquiry email delivery failed'"
];
for (const marker of required) {
  if (!source.includes(marker)) throw new Error(`Inquiry hardening marker missing: ${marker}`);
}
const forbidden = [
  "console.log(payload",
  "console.error(payload",
  "console.log(data",
  "console.error(data"
];
for (const marker of forbidden) {
  if (source.includes(marker)) throw new Error(`Sensitive inquiry logging is forbidden: ${marker}`);
}
console.log('Inquiry hardening validation passed.');
