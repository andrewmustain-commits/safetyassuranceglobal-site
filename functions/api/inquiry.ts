type Env = {
  FORM_WEBHOOK_URL?: string;
  FORM_WEBHOOK_AUTH_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  FORM_MAX_BODY_BYTES?: string;
};

type PagesContext<TEnv> = {
  request: Request;
  env: TEnv;
};

type IntakePayload = Record<string, unknown>;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8'
};

const MAX_DEFAULT = 16_384;

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

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const badRequest = (message: string, status = 400) =>
  new Response(JSON.stringify({ ok: false, message }), { status, headers: JSON_HEADERS });

const okResponse = (message: string) =>
  new Response(JSON.stringify({ ok: true, message }), { status: 200, headers: JSON_HEADERS });

const verifyTurnstile = async (token: string, secret: string, ip: string | null) => {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) {
    body.set('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
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

export const onRequestPost = async (context: PagesContext<Env>) => {
  const maxBytes = Number(context.env.FORM_MAX_BODY_BYTES || MAX_DEFAULT);
  const contentLength = Number(context.request.headers.get('content-length') || '0');

  if (contentLength > maxBytes) {
    return badRequest('Submission is too large.', 413);
  }

  let payload: IntakePayload;

  try {
    payload = (await context.request.json()) as IntakePayload;
  } catch {
    return badRequest('Invalid request payload.');
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return badRequest(validationError);
  }

  const turnstileSecret = context.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = asString(payload.turnstileToken);
    if (!token) {
      return badRequest('Spam verification token missing.');
    }

    const ip = context.request.headers.get('cf-connecting-ip');
    const passed = await verifyTurnstile(token, turnstileSecret, ip);
    if (!passed) {
      return badRequest('Spam verification failed.', 403);
    }
  }

  const webhookUrl = context.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    return badRequest(
      'Submission service is not configured for this environment. Please email contact@safetyassuranceglobal.com.',
      503
    );
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

  const upstream = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(forwardPayload)
  });

  if (!upstream.ok) {
    return badRequest('Submission could not be delivered. Please email contact@safetyassuranceglobal.com.', 502);
  }

  return okResponse('Submission received.');
};

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: {
      allow: 'POST, OPTIONS'
    }
  });
