import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
const workflow = await readFile(
  new URL('../.github/workflows/deploy-cloudflare-pages.yml', import.meta.url),
  'utf8'
);
const headers = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');

const failures = [];
const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};

requireValue(config.name === 'safetyassuranceglobal', 'Wrangler project name must match the existing Pages project.');
requireValue(config.pages_build_output_dir === './dist', 'Wrangler Pages output directory must be ./dist.');
requireValue(/^\d{4}-\d{2}-\d{2}$/.test(config.compatibility_date ?? ''), 'A Wrangler compatibility date is required.');
requireValue(config.compatibility_flags?.includes('nodejs_compat'), 'nodejs_compat must be explicit.');
requireValue(config.vars?.ENVIRONMENT === 'production', 'Top-level Pages environment must be production.');
requireValue(config.env?.preview?.vars?.ENVIRONMENT === 'preview', 'Preview Pages environment must be explicit.');

requireValue(!('secrets' in config), 'Pages does not support the Workers-only top-level secrets declaration.');
requireValue(!('secrets' in (config.env?.preview ?? {})), 'Pages preview config must not use a secrets declaration.');
for (const key of ['FORM_WEBHOOK_URL', 'FORM_WEBHOOK_AUTH_TOKEN', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY']) {
  requireValue(!JSON.stringify(config).includes(`\"${key}\"`), `${key} must remain in encrypted Cloudflare Pages settings.`);
}
requireValue(workflow.includes('command: pages deploy'), 'Deployment workflow must use Wrangler Pages deploy.');
requireValue(workflow.includes('--branch=main'), 'Production deployment must remain pinned to main.');
requireValue(workflow.includes('CLOUDFLARE_API_TOKEN'), 'Deployment workflow must use the Cloudflare API token secret.');
requireValue(workflow.includes('CLOUDFLARE_ACCOUNT_ID'), 'Deployment workflow must use the Cloudflare account ID secret.');
requireValue(headers.includes('Content-Security-Policy:'), 'Static responses require a CSP.');
requireValue(headers.includes('Cache-Control: public, max-age=31536000, immutable'), 'Fingerprint assets require immutable caching.');
requireValue(headers.includes('X-Robots-Tag: noindex'), 'Pages preview hosts must be excluded from indexing.');

if (failures.length) {
  console.error('Cloudflare production configuration validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Cloudflare production configuration validation passed.');
