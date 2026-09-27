type EmailSendResult = { messageId: string };

type EmailBinding = {
  send(message: {
    to?: string;
    from: string;
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<EmailSendResult>;
};

type Env = {
  EMAIL: EmailBinding;
};

type InquiryData = {
  name?: string;
  organization?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  serviceInterest?: string;
  message?: string;
  projectType?: string;
  serviceNeeded?: string;
  projectLocation?: string;
  anticipatedSchedule?: string;
  briefScope?: string;
  procurementContext?: string;
};

type DeliveryPayload = {
  formType?: string;
  submittedAt?: string;
  data?: InquiryData;
};

const FROM_ADDRESS = 'website@safetyassuranceglobal.com';
const DESTINATION = 'info@safetyassuranceglobal.com';
const MAX_BODY_BYTES = 16_384;
const MAX_AGE_MS = 10 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 2 * 60 * 1000;
const ALLOWED_ORIGINS = new Set([
  'https://safetyassuranceglobal.com',
  'https://www.safetyassuranceglobal.com'
]);

const isAllowedOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin);
};

const isFreshSubmission = (submittedAt: unknown, now = Date.now()) => {
  const value = clean(submittedAt, 64);
  if (!value) return false;
  const submitted = Date.parse(value);
  if (!Number.isFinite(submitted)) return false;
  const age = now - submitted;
  return age >= -MAX_FUTURE_SKEW_MS && age <= MAX_AGE_MS;
};

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      'x-content-type-options': 'nosniff'
    }
  });

const clean = (value: unknown, max = 3_000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const cleanHeader = (value: unknown, max: number) =>
  clean(value, max).replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

const readBodyWithinLimit = async (request: Request, maxBytes: number) => {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return null;
  }

  if (!request.body) {
    return new Uint8Array();
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
};

const formatBody = (payload: DeliveryPayload) => {
  const data = payload.data ?? {};
  const rows: Array<[string, string]> = [
    ['Form type', clean(payload.formType, 24)],
    ['Submitted at', clean(payload.submittedAt, 64)],
    ['Name', clean(data.name, 160)],
    ['Organization', clean(data.organization, 200)],
    ['Email', clean(data.email, 254)],
    ['Phone', clean(data.phone, 50)],
    ['Inquiry type', clean(data.inquiryType, 120)],
    ['Service interest', clean(data.serviceInterest, 120)],
    ['Operating challenge or need', clean(data.message)],
    ['Project type', clean(data.projectType, 120)],
    ['Service needed', clean(data.serviceNeeded, 120)],
    ['Project location', clean(data.projectLocation, 240)],
    ['Anticipated schedule', clean(data.anticipatedSchedule, 120)],
    ['Brief scope', clean(data.briefScope)],
    ['Procurement context', clean(data.procurementContext)]
  ];

  return [
    'Safety Assurance Global website intake',
    '',
    ...rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`)
  ].join('\n');
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return json({ ok: false, message: 'Method not allowed.' }, 405);
    }

    if (!isAllowedOrigin(request)) {
      return json({ ok: false, message: 'Origin not allowed.' }, 403);
    }

    const fetchSite = request.headers.get('sec-fetch-site');
    if (fetchSite && !['same-origin', 'same-site'].includes(fetchSite)) {
      return json({ ok: false, message: 'Cross-site request not allowed.' }, 403);
    }

    const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.startsWith('application/json')) {
      return json({ ok: false, message: 'Content-Type must be application/json.' }, 415);
    }

    let payload: DeliveryPayload;
    try {
      const body = await readBodyWithinLimit(request, MAX_BODY_BYTES);
      if (!body) {
        return json({ ok: false, message: 'Payload too large.' }, 413);
      }
      payload = JSON.parse(new TextDecoder().decode(body)) as DeliveryPayload;
    } catch {
      return json({ ok: false, message: 'Invalid JSON payload.' }, 400);
    }

    if (!isFreshSubmission(payload.submittedAt)) {
      return json({ ok: false, message: 'Submission timestamp is missing, expired, or invalid.' }, 400);
    }

    const formType = cleanHeader(payload.formType, 24).toLowerCase();
    const data = payload.data ?? {};
    const replyTo = cleanHeader(data.email, 254);

    if (!['contact', 'proposal'].includes(formType) || !replyTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
      return json({ ok: false, message: 'Invalid delivery payload.' }, 400);
    }

    const organization = cleanHeader(data.organization, 120) || cleanHeader(data.name, 120) || 'Prospective client';
    const subject = formType === 'proposal'
      ? `Website proposal request — ${organization}`
      : `Website inquiry — ${organization}`;

    try {
      const result = await env.EMAIL.send({
        to: DESTINATION,
        from: FROM_ADDRESS,
        replyTo,
        subject: cleanHeader(subject, 160),
        text: formatBody(payload)
      });

      return json({ ok: true, messageId: result.messageId }, 200);
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'EMAIL_DELIVERY_FAILED';
      console.error('Inquiry email delivery failed', {
        code,
        formType,
        occurredAt: new Date().toISOString()
      });
      return json({ ok: false, message: 'Email delivery failed.' }, 502);
    }
  }
};
