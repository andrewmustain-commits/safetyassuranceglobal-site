type Env = {
  FORM_WEBHOOK_URL?: string;
  FORM_WEBHOOK_AUTH_TOKEN?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  FORM_MAX_BODY_BYTES?: string;
};

type PagesContext<TEnv> = {
  request: Request;
  env: TEnv;
};

type IntakePayload = Record<string, unknown>;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer'
};

const MAX_DEFAULT = 16_384;
const UPSTREAM_TIMEOUT_MS = 10_000;
const PRIMARY_FALLBACK_EMAIL = 'info@safetyassuranceglobal.com';
const SECONDARY_FALLBACK_EMAIL = 'contact@safetyassuranceglobal.com';
const fallbackMessage = `Please email ${PRIMARY_FALLBACK_EMAIL}. ${SECONDARY_FALLBACK_EMAIL} is also available.`;

const requiredByType: Record<string, string[]> = {
  contact: ['name', 'organization', 'email', 'inquiryType', 'serviceInterest', 'message', 'privacyAcknowledgement'],
  proposal: [
    'name',
    'organization',
    'email',
    'projectType',
    'serviceNeeded',
    'projectLocation',
    'anticipatedSchedule',
    'briefScope',
    'procurementContext',
    'privacyAcknowledgement'
  ]
};

const fieldLimits: Record<string, number> = {
  formType: 24,
  name: 160,
  organization: 200,
  email: 254,
  phone: 50,
  inquiryType: 120,
  serviceInterest: 120,
  message: 3_000,
  projectType: 120,
  serviceNeeded: 120,
  projectLocation: 240,
  anticipatedSchedule: 120,
  briefScope: 3_000,
  procurementContext: 3_000,
  website: 200,
  turnstileToken: 2_048
};

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

const badRequest = (message: string, status = 400) => jsonResponse({ ok: false, message }, status);
const okResponse = (message: string) => jsonResponse({ ok: true, message }, 200);

const getTurnstileState = (env: Env) => {
  const siteKey = asString(env.TURNSTILE_SITE_KEY);
  const secretKey = asString(env.TURNSTILE_SECRET_KEY);
  const enabled = Boolean(siteKey && secretKey);
  const misconfigured = Boolean(siteKey) !== Boolean(secretKey);

  return { siteKey, secretKey, enabled, misconfigured };
};

const isJsonRequest = (request: Request) => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  return contentType.startsWith('application/json');
};

const isSameOriginBrowserRequest = (request: Request) => {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin && origin !== requestOrigin) {
    return false;
  }

  const fetchSite = request.headers.get('sec-fetch-site')?.toLowerCase();
  if (fetchSite === 'cross-site') {
    return false;
  }

  return true;
};

const exceedsDeclaredBodyLimit = (request: Request, maxBytes: number) => {
  const declared = request.headers.get('content-length');
  if (!declared) {
    return false;
  }

  const length = Number(declared);
  return Number.isFinite(length) && length > maxBytes;
};

const validatePayload = (payload: IntakePayload) => {
  const formType = asString(payload.formType).toLowerCase();

  if (!requiredByType[formType]) {
    return 'Unknown form type.';
  }

  if (asString(payload.website)) {
    return 'Submission blocked by spam protection.';
  }

  if (payload.privacyAcknowledgement !== true) {
    return 'Privacy acknowledgement is required.';
  }

  for (const [field, maxLength] of Object.entries(fieldLimits)) {
    const value = asString(payload[field]);
    if (value.length > maxLength) {
      return `Field is too long: ${field}.`;
    }
  }

  const required = requiredByType[formType];
  for (const field of required) {
    if (field === 'privacyAcknowledgement') {
      continue;
    }

    if (!asString(payload[field])) {
      return `Required field missing: ${field}.`;
    }
  }

  const email = asString(payload.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Business email is invalid.';
  }

  return null;
};

const verifyTurnstile = async (token: string, secret: string, ip: string | null) => {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) {
    body.set('remoteip', ip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
};

const getSecureWebhookUrl = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

export const onRequestGet = async (context: PagesContext<Env>) => {
  if (!isSameOriginBrowserRequest(context.request)) {
    return badRequest('Cross-site request is not allowed.', 403);
  }

  const turnstile = getTurnstileState(context.env);
  if (turnstile.misconfigured) {
    return badRequest('Spam protection is not fully configured for this environment.', 503);
  }

  const deliveryConfigured = Boolean(getSecureWebhookUrl(context.env.FORM_WEBHOOK_URL));

  return jsonResponse(
    {
      ok: true,
      delivery: {
        configured: deliveryConfigured
      },
      turnstile: {
        enabled: turnstile.enabled,
        siteKey: turnstile.enabled ? turnstile.siteKey : null
      }
    },
    200
  );
};

export const onRequestPost = async (context: PagesContext<Env>) => {
  if (!isJsonRequest(context.request)) {
    return badRequest('Content-Type must be application/json.', 415);
  }

  if (!isSameOriginBrowserRequest(context.request)) {
    return badRequest('Cross-site submission is not allowed.', 403);
  }

  const rawMaxBytes = Number(context.env.FORM_MAX_BODY_BYTES);
  const maxBytes = Number.isFinite(rawMaxBytes) && rawMaxBytes > 0 ? rawMaxBytes : MAX_DEFAULT;

  if (exceedsDeclaredBodyLimit(context.request, maxBytes)) {
    return badRequest('Submission is too large.', 413);
  }

  let payload: IntakePayload;

  try {
    const buffer = await context.request.arrayBuffer();
    if (buffer.byteLength > maxBytes) {
      return badRequest('Submission is too large.', 413);
    }

    const parsed = JSON.parse(new TextDecoder().decode(buffer)) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return badRequest('Invalid request payload.');
    }
    payload = parsed as IntakePayload;
  } catch {
    return badRequest('Invalid request payload.');
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return badRequest(validationError);
  }

  const turnstile = getTurnstileState(context.env);
  if (turnstile.misconfigured) {
    return badRequest(`Spam protection is not fully configured for this environment. ${fallbackMessage}`, 503);
  }

  if (turnstile.enabled) {
    const token = asString(payload.turnstileToken);
    if (!token) {
      return badRequest('Spam verification token missing.');
    }

    const ip = context.request.headers.get('cf-connecting-ip');
    const passed = await verifyTurnstile(token, turnstile.secretKey, ip);
    if (!passed) {
      return badRequest('Spam verification failed.', 403);
    }
  }

  const webhookUrl = getSecureWebhookUrl(context.env.FORM_WEBHOOK_URL);
  if (!webhookUrl) {
    return badRequest(`Submission service is not configured for this environment. ${fallbackMessage}`, 503);
  }

  const forwardPayload = {
    formType: asString(payload.formType),
    submittedAt: new Date().toISOString(),
    data: {
      name: asString(payload.name),
      organization: asString(payload.organization),
      email: asString(payload.email),
      phone: asString(payload.phone),
      inquiryType: asString(payload.inquiryType),
      serviceInterest: asString(payload.serviceInterest),
      message: asString(payload.message),
      projectType: asString(payload.projectType),
      serviceNeeded: asString(payload.serviceNeeded),
      projectLocation: asString(payload.projectLocation),
      anticipatedSchedule: asString(payload.anticipatedSchedule),
      briefScope: asString(payload.briefScope),
      procurementContext: asString(payload.procurementContext)
    }
  };

  const headers: Record<string, string> = {
    'content-type': 'application/json'
  };

  if (context.env.FORM_WEBHOOK_AUTH_TOKEN) {
    headers.authorization = `Bearer ${context.env.FORM_WEBHOOK_AUTH_TOKEN}`;
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(forwardPayload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });

    if (!upstream.ok) {
      return badRequest(`Submission could not be delivered. ${fallbackMessage}`, 502);
    }
  } catch {
    return badRequest(`Submission could not be delivered. ${fallbackMessage}`, 502);
  }

  return okResponse('Submission received.');
};

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: {
      allow: 'GET, POST, OPTIONS',
      'cache-control': 'no-store, max-age=0',
      'x-content-type-options': 'nosniff'
    }
  });
