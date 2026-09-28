const SITE_ORIGIN = 'https://safetyassuranceglobal.com';
const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 6000;
const REQUEST_TIMEOUT_MS = 10000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (pathname, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(new URL(pathname, SITE_ORIGIN), {
      method: options.method ?? 'GET',
      redirect: options.redirect ?? 'follow',
      headers: { 'user-agent': 'SAG-Production-Smoke/1.0', ...(options.headers ?? {}) },
      body: options.body,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const failures = [];

const retry = async (label, check) => {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await check();
      console.log(`PASS ${label} (attempt ${attempt})`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  failures.push(`${label}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
};

const expectStatus = async (pathname, expectedStatus, contains) => {
  const response = await request(pathname);
  if (response.status !== expectedStatus) {
    throw new Error(`expected HTTP ${expectedStatus}, received ${response.status}`);
  }
  if (contains) {
    const body = await response.text();
    if (!body.includes(contains)) throw new Error(`response body missing expected marker: ${contains}`);
  }
};

const expectRedirect = async (pathname, expectedLocation) => {
  const response = await request(pathname, { redirect: 'manual' });
  if (response.status !== 301) {
    throw new Error(`expected HTTP 301, received ${response.status}`);
  }
  const location = response.headers.get('location');
  if (!location) throw new Error('missing Location header');
  const normalized = new URL(location, SITE_ORIGIN).pathname.replace(/\/$/, '') || '/';
  const expected = expectedLocation.replace(/\/$/, '') || '/';
  if (normalized !== expected) {
    throw new Error(`expected redirect to ${expectedLocation}, received ${location}`);
  }
};

const expectHeaderIncludes = async (pathname, headerName, expectedValue) => {
  const response = await request(pathname);
  if (!response.ok) throw new Error(`expected successful response, received ${response.status}`);
  const value = response.headers.get(headerName);
  if (!value || !value.toLowerCase().includes(expectedValue.toLowerCase())) {
    throw new Error(`expected ${headerName} to include ${expectedValue}, received ${value ?? 'missing header'}`);
  }
};

await retry('homepage', () => expectStatus('/', 200, 'Maritime Assurance &amp; Operational Readiness'));
await retry('contact route', () => expectStatus('/contact', 200, 'info@safetyassuranceglobal.com'));
await retry('proposal route', () => expectStatus('/request-proposal', 200, 'Request a Proposal'));
await retry('capabilities route', () => expectStatus('/capabilities', 200, 'RCUUJLWEBGD4'));
await retry('start-a-scope route', () => expectStatus('/start', 200, 'Build a preliminary assurance scope'));
await retry('proof center route', () => expectStatus('/proof', 200, 'Evidence Before Claims'));
await retry('customer resources route', () => expectStatus('/resources', 200, 'Customer Resource Center'));
await retry('readiness snapshot route', () => expectStatus('/readiness-check', 200, 'Preliminary readiness snapshot'));
await retry('prime and teaming route', () => expectStatus('/partners', 200, 'Prime Contractor &amp; Teaming'));
await retry('illustrative engagements route', () => expectStatus('/engagement-examples', 200, 'Illustrative Engagements'));
await retry('leadership route', () => expectStatus('/leadership', 200, 'Named Leadership'));
await retry('sample deliverables route', () => expectStatus('/sample-deliverables', 200, 'Illustrative Deliverables'));
await retry('service sheets route', () => expectStatus('/service-sheets', 200, 'Service Sheets'));
await retry('robots.txt', () => expectStatus('/robots.txt', 200, 'sitemap-index.xml'));
await retry('security.txt', () => expectStatus('/.well-known/security.txt', 200, 'Contact:'));
await retry('sitemap index', () => expectStatus('/sitemap-index.xml', 200, '<sitemapindex'));
await retry('homepage security headers', () => expectHeaderIncludes('/', 'content-security-policy', "default-src 'self'"));
await retry('brand image cache policy', () => expectHeaderIncludes('/images/brand/sag-official-seal-2026.png', 'cache-control', 'max-age=604800'));
await retry('readiness matrix download', () => expectStatus('/downloads/readiness-evidence-matrix-template.csv', 200, 'Requirement'));
await retry('corrective-action register download', () => expectStatus('/downloads/corrective-action-register-template.csv', 200, 'Finding'));
await retry('contractor readiness checklist download', () => expectStatus('/downloads/contractor-readiness-checklist.csv', 200, 'Readiness Question'));
await retry('QA/QC verification log download', () => expectStatus('/downloads/qa-qc-verification-log-template.csv', 200, 'Verification'));

await retry('academy redirect', () => expectRedirect('/academy', '/institute'));
await retry('academy trailing-slash redirect', () => expectRedirect('/academy/', '/institute'));
await retry('blog redirect', () => expectRedirect('/blog', '/insights'));
await retry('terms redirect', () => expectRedirect('/terms', '/terms-of-use'));
await retry('terms trailing-slash redirect', () => expectRedirect('/terms/', '/terms-of-use'));
await retry('command redirect', () => expectRedirect('/command', '/sag-command'));
await retry('command trailing-slash redirect', () => expectRedirect('/command/', '/sag-command'));
await retry('security alias redirect', () => expectRedirect('/security.txt', '/.well-known/security.txt'));
await retry('held legacy article redirect', () =>
  expectRedirect('/blog/infrastructure-of-integrity-risk-governance', '/insights')
);

await retry('unknown route returns custom 404 status', async () => {
  const response = await request('/__sag-production-smoke-not-found__');
  if (response.status !== 404) throw new Error(`expected HTTP 404, received ${response.status}`);
});

await retry('inquiry runtime configuration', async () => {
  const response = await request('/api/inquiry', {
    headers: { Accept: 'application/json' }
  });
  if (response.status !== 200) throw new Error(`expected HTTP 200, received ${response.status}`);
  const payload = await response.json();
  if (!payload || payload.ok !== true) throw new Error('runtime response is not ok');
  if (!payload.delivery || payload.delivery.configured !== true) {
    throw new Error('production inquiry delivery is not configured=true');
  }
  if (!payload.turnstile || payload.turnstile.enabled !== true) {
    throw new Error('production Turnstile is not enabled=true');
  }
  console.log(`INFO inquiry delivery configured: ${payload.delivery.configured}`);
  console.log(`INFO Turnstile enabled: ${payload.turnstile.enabled}`);
});

const syntheticContactPayload = {
  formType: 'contact',
  name: 'SAG Production Smoke',
  organization: 'Safety Assurance Global',
  email: 'info@safetyassuranceglobal.com',
  inquiryType: 'Production verification',
  serviceInterest: 'Inquiry delivery negative-path verification',
  message: 'Synthetic request used to confirm Turnstile rejects unauthenticated production submissions before delivery.',
  privacyAcknowledgement: true,
  website: ''
};

await retry('inquiry rejects missing Turnstile token before delivery', async () => {
  const response = await request('/api/inquiry', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: SITE_ORIGIN,
      'Sec-Fetch-Site': 'same-origin'
    },
    body: JSON.stringify(syntheticContactPayload)
  });
  const payload = await response.json();
  if (response.status !== 400) throw new Error(`expected HTTP 400, received ${response.status}`);
  if (payload?.ok !== false || payload?.message !== 'Spam verification token missing.') {
    throw new Error('missing-token response did not fail closed as expected');
  }
});

await retry('inquiry rejects invalid Turnstile token before delivery', async () => {
  const response = await request('/api/inquiry', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: SITE_ORIGIN,
      'Sec-Fetch-Site': 'same-origin'
    },
    body: JSON.stringify({ ...syntheticContactPayload, turnstileToken: 'synthetic-invalid-token' })
  });
  const payload = await response.json();
  if (response.status !== 403) throw new Error(`expected HTTP 403, received ${response.status}`);
  if (payload?.ok !== false || payload?.message !== 'Spam verification failed.') {
    throw new Error('invalid-token response did not fail closed as expected');
  }
});

if (failures.length) {
  console.error('Production smoke verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Production smoke verification passed.');
