import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];

const server = read('functions/api/inquiry.ts');
const client = read('public/scripts/intake-form.js');
const contact = read('src/components/forms/ContactInquiryForm.astro');
const proposal = read('src/components/forms/ProposalRequestForm.astro');
const headers = read('public/_headers');

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(label);
};

requireText(server, 'TURNSTILE_SITE_KEY', 'Server runtime is missing TURNSTILE_SITE_KEY support.');
requireText(server, 'TURNSTILE_SECRET_KEY', 'Server runtime is missing TURNSTILE_SECRET_KEY support.');
requireText(server, 'turnstile.misconfigured', 'Server runtime does not fail closed on mismatched Turnstile keys.');
requireText(server, 'verifyTurnstile', 'Server runtime is missing Turnstile verification.');
requireText(server, 'onRequestGet', 'Server runtime is missing same-origin runtime configuration discovery.');
requireText(server, 'FORM_WEBHOOK_URL', 'Server runtime is missing form webhook delivery support.');
requireText(server, 'deliveryConfigured', 'Server runtime does not expose a safe boolean delivery readiness state.');
requireText(server, 'getSecureWebhookUrl(context.env.FORM_WEBHOOK_URL)', 'Delivery readiness does not validate the configured webhook as HTTPS.');

requireText(client, "fetch('/api/inquiry'", 'Client does not read the intake runtime configuration.');
requireText(client, 'challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', 'Client is missing the official Turnstile script endpoint.');
requireText(client, 'payload.turnstileToken', 'Client does not forward a Turnstile token.');
requireText(client, 'data-turnstile-container', 'Client does not target a Turnstile render container.');
requireText(client, "form.dataset.deliveryConfigured = 'unknown'", 'Client does not default delivery readiness to a fail-closed state.');
requireText(client, 'config.delivery.configured === true', 'Client does not consume the server delivery readiness state.');
requireText(client, "form.dataset.deliveryConfigured !== 'true'", 'Client does not block submission when delivery is unavailable.');
requireText(client, 'Online inquiry delivery is temporarily unavailable.', 'Client does not provide a buyer-visible delivery outage fallback.');

requireText(contact, 'data-turnstile-container', 'Contact form is missing its Turnstile render container.');
requireText(proposal, 'data-turnstile-container', 'Proposal form is missing its Turnstile render container.');

requireText(headers, "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com", 'CSP script-src does not allow Cloudflare Turnstile.');
requireText(headers, "frame-src https://challenges.cloudflare.com", 'CSP frame-src does not allow Cloudflare Turnstile.');
requireText(headers, "connect-src 'self' https://challenges.cloudflare.com", 'CSP connect-src does not allow Cloudflare Turnstile.');

if (failures.length) {
  console.error('Turnstile and intake delivery integration validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Turnstile and intake delivery integration validation passed.');
