import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];

const server = read('functions/api/inquiry.ts');
const client = read('public/scripts/intake-form.js');
const contact = read('src/components/forms/ContactInquiryForm.astro');
const proposal = read('src/components/forms/ProposalRequestForm.astro');
const contactPage = read('src/pages/contact.astro');
const institutePage = read('src/pages/institute.astro');
const trainingPage = read('src/pages/training.astro');
const commandPage = read('src/pages/sag-command.astro');
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
requireText(server, "PRIMARY_FALLBACK_EMAIL = 'info@safetyassuranceglobal.com'", 'Server primary fallback email must be info@safetyassuranceglobal.com.');
requireText(server, "SECONDARY_FALLBACK_EMAIL = 'contact@safetyassuranceglobal.com'", 'Server secondary fallback email must remain contact@safetyassuranceglobal.com.');

requireText(client, "fetch('/api/inquiry'", 'Client does not read the intake runtime configuration.');
requireText(client, 'challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', 'Client is missing the official Turnstile script endpoint.');
requireText(client, 'payload.turnstileToken', 'Client does not forward a Turnstile token.');
requireText(client, 'data-turnstile-container', 'Client does not target a Turnstile render container.');
requireText(client, "form.dataset.deliveryConfigured = 'unknown'", 'Client does not initialize delivery readiness state.');
requireText(client, 'config.delivery.configured === true', 'Client does not consume the server delivery readiness state.');
requireText(client, "PRIMARY_FALLBACK_EMAIL = 'info@safetyassuranceglobal.com'", 'Client primary fallback email must be info@safetyassuranceglobal.com.');
requireText(client, "SECONDARY_FALLBACK_EMAIL = 'contact@safetyassuranceglobal.com'", 'Client secondary fallback email must remain contact@safetyassuranceglobal.com.');
requireText(client, 'buildFallbackMailto', 'Client is missing the prefilled email fallback builder.');
requireText(client, 'openEmailFallback', 'Client is missing the email fallback submission path.');
requireText(client, 'window.location.href = buildFallbackMailto(payload)', 'Client does not open the completed request in the visitor email app when secure delivery fails.');
requireText(client, 'submitButton.disabled = false', 'Client must keep the submit action available when webhook delivery is not configured.');

requireText(contact, 'data-turnstile-container', 'Contact form is missing its Turnstile render container.');
requireText(proposal, 'data-turnstile-container', 'Proposal form is missing its Turnstile render container.');

requireText(contactPage, 'mailto:info@safetyassuranceglobal.com', 'Contact page must expose info@safetyassuranceglobal.com as the primary general mailbox.');
requireText(contactPage, 'mailto:contact@safetyassuranceglobal.com', 'Contact page must retain contact@safetyassuranceglobal.com as a secondary mailbox.');
requireText(contactPage, 'mailto:academy@safetyassuranceglobal.com', 'Contact page must expose the Academy mailbox.');
requireText(contactPage, 'mailto:command@safetyassuranceglobal.com', 'Contact page must expose the SAG Command mailbox.');
requireText(institutePage, 'academy@safetyassuranceglobal.com', 'Institute page must route inquiries to academy@safetyassuranceglobal.com.');
requireText(trainingPage, 'academy@safetyassuranceglobal.com', 'Training page must route inquiries to academy@safetyassuranceglobal.com.');
requireText(commandPage, 'command@safetyassuranceglobal.com', 'SAG Command page must route inquiries to command@safetyassuranceglobal.com.');

requireText(headers, "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com", 'CSP script-src does not allow Cloudflare Turnstile.');
requireText(headers, 'frame-src https://challenges.cloudflare.com', 'CSP frame-src does not allow Cloudflare Turnstile.');
requireText(headers, "connect-src 'self' https://challenges.cloudflare.com", 'CSP connect-src does not allow Cloudflare Turnstile.');

if (failures.length) {
  console.error('Turnstile and intake delivery integration validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Turnstile and intake delivery integration validation passed.');
