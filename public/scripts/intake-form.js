(function () {
  const forms = document.querySelectorAll('[data-intake-form]');

  const MAX_MESSAGE_LENGTH = 3000;
  const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  const PRIMARY_FALLBACK_EMAIL = 'info@safetyassuranceglobal.com';
  const SECONDARY_FALLBACK_EMAIL = 'contact@safetyassuranceglobal.com';
  let turnstileScriptPromise;

  const setStatus = (statusEl, message, kind) => {
    if (!statusEl) {
      return;
    }

    statusEl.textContent = message;
    statusEl.classList.remove('lead-form-status-success', 'lead-form-status-error');
    if (kind === 'success') {
      statusEl.classList.add('lead-form-status-success');
    }
    if (kind === 'error') {
      statusEl.classList.add('lead-form-status-error');
    }
  };

  const loadTurnstile = () => {
    if (window.turnstile) {
      return Promise.resolve(window.turnstile);
    }

    if (turnstileScriptPromise) {
      return turnstileScriptPromise;
    }

    turnstileScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.turnstile) {
          resolve(window.turnstile);
          return;
        }
        reject(new Error('Turnstile did not initialize.'));
      };
      script.onerror = () => reject(new Error('Turnstile script could not be loaded.'));
      document.head.appendChild(script);
    });

    return turnstileScriptPromise;
  };

  const getRuntimeConfig = async () => {
    const response = await fetch('/api/inquiry', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store'
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.ok !== true) {
      const message = result && typeof result.message === 'string'
        ? result.message
        : 'Inquiry service configuration could not be verified.';
      throw new Error(message);
    }

    return result;
  };

  const toPayload = (form) => {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.formType = form.getAttribute('data-form-type') || 'contact';
    payload.userAgent = navigator.userAgent;
    payload.turnstileToken = form.dataset.turnstileToken || '';

    if (typeof payload.message === 'string' && payload.message.length > MAX_MESSAGE_LENGTH) {
      payload.message = payload.message.slice(0, MAX_MESSAGE_LENGTH);
    }

    if (typeof payload.briefScope === 'string' && payload.briefScope.length > MAX_MESSAGE_LENGTH) {
      payload.briefScope = payload.briefScope.slice(0, MAX_MESSAGE_LENGTH);
    }

    if (typeof payload.procurementContext === 'string' && payload.procurementContext.length > MAX_MESSAGE_LENGTH) {
      payload.procurementContext = payload.procurementContext.slice(0, MAX_MESSAGE_LENGTH);
    }

    payload.privacyAcknowledgement = formData.get('privacyAcknowledgement') === 'on';

    return payload;
  };

  const buildFallbackMailto = (payload) => {
    const isProposal = payload.formType === 'proposal';
    const subject = isProposal
      ? `Website proposal request — ${payload.organization || payload.name || 'Prospective client'}`
      : `Website inquiry — ${payload.organization || payload.name || 'Prospective client'}`;

    const fields = isProposal
      ? [
          ['Name', payload.name],
          ['Organization', payload.organization],
          ['Email', payload.email],
          ['Phone', payload.phone],
          ['Project type', payload.projectType],
          ['Service needed', payload.serviceNeeded],
          ['Project location', payload.projectLocation],
          ['Anticipated schedule', payload.anticipatedSchedule],
          ['Brief scope', payload.briefScope],
          ['Procurement context', payload.procurementContext]
        ]
      : [
          ['Name', payload.name],
          ['Organization', payload.organization],
          ['Email', payload.email],
          ['Phone', payload.phone],
          ['Inquiry type', payload.inquiryType],
          ['Service interest', payload.serviceInterest],
          ['Operating challenge or need', payload.message]
        ];

    const body = [
      'Safety Assurance Global website request',
      '',
      ...fields.map(([label, value]) => `${label}: ${value || ''}`),
      '',
      'Privacy acknowledgement: Yes',
      '',
      `If delivery to ${PRIMARY_FALLBACK_EMAIL} is unavailable, please forward to ${SECONDARY_FALLBACK_EMAIL}.`
    ].join('\n');

    return `mailto:${PRIMARY_FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const openEmailFallback = (form, status) => {
    if (!form.checkValidity()) {
      setStatus(status, 'Please complete the required fields before continuing.', 'error');
      form.reportValidity();
      return false;
    }

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      setStatus(status, 'Submission blocked by spam protection.', 'error');
      return false;
    }

    const payload = toPayload(form);
    setStatus(
      status,
      `Opening your email app to send this request to ${PRIMARY_FALLBACK_EMAIL}. If needed, you can also email ${SECONDARY_FALLBACK_EMAIL}.`,
      'success'
    );
    window.location.href = buildFallbackMailto(payload);
    return true;
  };

  const initializeTurnstile = async (form, status, config) => {
    const turnstileConfig = config && config.turnstile;
    if (!turnstileConfig || turnstileConfig.enabled !== true || typeof turnstileConfig.siteKey !== 'string') {
      form.dataset.turnstileEnabled = 'false';
      return;
    }

    form.dataset.turnstileEnabled = 'true';
    const container = form.querySelector('[data-turnstile-container]');
    if (!(container instanceof HTMLElement)) {
      throw new Error('Spam verification control is unavailable.');
    }

    container.hidden = false;
    const turnstile = await loadTurnstile();
    turnstile.render(container, {
      sitekey: turnstileConfig.siteKey,
      theme: 'dark',
      appearance: 'interaction-only',
      callback: (token) => {
        form.dataset.turnstileToken = token;
        setStatus(status, '', '');
      },
      'expired-callback': () => {
        form.dataset.turnstileToken = '';
      },
      'error-callback': () => {
        form.dataset.turnstileToken = '';
        setStatus(status, 'Spam verification could not be completed. Please try again.', 'error');
      }
    });
  };

  const runtimeConfigPromise = getRuntimeConfig();

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
    }
    form.dataset.deliveryConfigured = 'unknown';

    runtimeConfigPromise
      .then((config) => {
        const deliveryConfigured = Boolean(config && config.delivery && config.delivery.configured === true);
        form.dataset.deliveryConfigured = String(deliveryConfigured);

        if (!deliveryConfigured) {
          form.dataset.turnstileEnabled = 'false';
          setStatus(
            status,
            `Secure online delivery is being configured. Submit will open a prefilled email to ${PRIMARY_FALLBACK_EMAIL}; ${SECONDARY_FALLBACK_EMAIL} is also available.`,
            ''
          );
          return;
        }

        return initializeTurnstile(form, status, config);
      })
      .catch(() => {
        form.dataset.turnstileEnabled = 'false';
        form.dataset.deliveryConfigured = 'false';
        setStatus(
          status,
          `Online delivery could not be verified. Submit will open a prefilled email to ${PRIMARY_FALLBACK_EMAIL}; ${SECONDARY_FALLBACK_EMAIL} is also available.`,
          ''
        );
      });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (form.dataset.deliveryConfigured !== 'true') {
        openEmailFallback(form, status);
        return;
      }

      if (!form.checkValidity()) {
        setStatus(status, 'Please complete the required fields before continuing.', 'error');
        form.reportValidity();
        return;
      }

      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        setStatus(status, 'Submission blocked by spam protection.', 'error');
        return;
      }

      if (form.dataset.turnstileEnabled === 'true' && !form.dataset.turnstileToken) {
        setStatus(status, 'Please complete the spam verification before submitting.', 'error');
        return;
      }

      if (form.dataset.turnstileEnabled === 'unknown') {
        openEmailFallback(form, status);
        return;
      }

      setStatus(status, 'Submitting your inquiry...', '');
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }

      try {
        const payload = toPayload(form);
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(function () {
          return { ok: false, message: 'Unexpected response from intake service.' };
        });

        if (!response.ok || !result.ok) {
          setStatus(status, 'Secure delivery was unavailable. Opening your email app with the completed request instead.', 'error');
          window.location.href = buildFallbackMailto(payload);
          return;
        }

        form.reset();
        form.dataset.turnstileToken = '';
        setStatus(status, 'Submission received. Our team will follow up using your provided contact details.', 'success');
      } catch (_error) {
        const payload = toPayload(form);
        setStatus(status, 'Secure delivery was unavailable. Opening your email app with the completed request instead.', 'error');
        window.location.href = buildFallbackMailto(payload);
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });
  });
})();
