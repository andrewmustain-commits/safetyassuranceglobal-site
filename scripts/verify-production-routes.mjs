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
      redirect: options.redirect ?? 'follow',
      headers: { 'user-agent': 'SAG-Production-Smoke/1.0', ...(options.headers ?? {}) },
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

await retry('homepage', () => expectStatus('/', 200, 'Safety Assurance Global'));
await retry('robots.txt', () => expectStatus('/robots.txt', 200, 'sitemap-index.xml'));
await retry('security.txt', () => expectStatus('/.well-known/security.txt', 200, 'Contact:'));
await retry('sitemap index', () => expectStatus('/sitemap-index.xml', 200, '<sitemapindex'));

await retry('academy redirect', () => expectRedirect('/academy', '/institute'));
await retry('blog redirect', () => expectRedirect('/blog', '/insights'));
await retry('terms redirect', () => expectRedirect('/terms', '/terms-of-use'));
await retry('command redirect', () => expectRedirect('/command', '/sag-command'));
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
  if (!payload.delivery || typeof payload.delivery.configured !== 'boolean') {
    throw new Error('runtime response is missing delivery.configured boolean');
  }
  if (!payload.turnstile || typeof payload.turnstile.enabled !== 'boolean') {
    throw new Error('runtime response is missing turnstile.enabled boolean');
  }
  console.log(`INFO inquiry delivery configured: ${payload.delivery.configured}`);
  console.log(`INFO Turnstile enabled: ${payload.turnstile.enabled}`);
});

if (failures.length) {
  console.error('Production smoke verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Production smoke verification passed.');
