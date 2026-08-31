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

    const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.startsWith('application/json')) {
      return json({ ok: false, message: 'Content-Type must be application/json.' }, 415);
    }

    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: 'Payload too large.' }, 413);
    }

    let payload: DeliveryPayload;
    try {
      const body = await request.arrayBuffer();
      if (body.byteLength > MAX_BODY_BYTES) {
        return json({ ok: false, message: 'Payload too large.' }, 413);
      }
      payload = JSON.parse(new TextDecoder().decode(body)) as DeliveryPayload;
    } catch {
      return json({ ok: false, message: 'Invalid JSON payload.' }, 400);
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
      console.error('Inquiry email delivery failed', { code });
      return json({ ok: false, message: 'Email delivery failed.' }, 502);
    }
  }
};
