(function () {
  const forms = document.querySelectorAll('[data-intake-form]');

  const FIELD_LIMITS = Object.freeze({
    message: 3000,
    briefScope: 3000,
    procurementContext: 3000
  });
  const MAX_FALLBACK_SUBJECT_CHARS = 160;
  const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  const TURNSTILE_ACTION = 'inquiry_submit';
  const PRIMARY_FALLBACK_EMAIL = 'info@safetyassuranceglobal.com';
  const SECONDARY_FALLBACK_EMAIL = 'contact@safetyassuranceglobal.com';
  let turnstileScriptPromise;

  const emitMeasurement = (name) => document.dispatchEvent(new CustomEvent('sag:intake-event', { detail: { name } }));

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

    payload.privacyAcknowledgement = formData.get('privacyAcknowledgement') === 'on';

    return payload;
  };

  const buildFallbackSubject = (payload) => {
    const isProposal = payload.formType === 'proposal';
    const rawSubject = isProposal
      ? `Website proposal request — ${payload.organization || payload.name || 'Prospective client'}`
      : `Website inquiry — ${payload.organization || payload.name || 'Prospective client'}`;
    return rawSubject.slice(0, MAX_FALLBACK_SUBJECT_CHARS);
  };

  const buildFallbackText = (payload) => {
    const isProposal = payload.formType === 'proposal';
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

    return [
      'Safety Assurance Global website request',
      '',
      ...fields.map(([label, value]) => `${label}: ${value || ''}`),
      '',
      'Privacy acknowledgement: Yes',
      '',
      `Primary destination: ${PRIMARY_FALLBACK_EMAIL}`,
      `Secondary destination: ${SECONDARY_FALLBACK_EMAIL}`
    ].join('\n');
  };

  const downloadFallbackRequest = (payload) => {
    const rawBody = buildFallbackText(payload);
    const blob = new Blob([rawBody], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = payload.formType === 'proposal'
      ? 'sag-proposal-request.txt'
      : 'sag-contact-request.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const handoffFallbackRequest = (payload, status) => {
    downloadFallbackRequest(payload);
    setStatus(
      status,
      `Secure delivery is unavailable. Your completed request was downloaded as a text file. Your email app will open next; paste or attach that file to ${PRIMARY_FALLBACK_EMAIL}. If needed, use ${SECONDARY_FALLBACK_EMAIL}.`,
      'success'
    );

    const subject = buildFallbackSubject(payload);
    const shortBody = [
      'My completed Safety Assurance Global website request was preserved in a downloaded text file.',
      '',
      'Please paste or attach that file to this email before sending.',
      '',
      `If delivery to ${PRIMARY_FALLBACK_EMAIL} is unavailable, please send it to ${SECONDARY_FALLBACK_EMAIL}.`
    ].join('\n');
    window.location.href = `mailto:${PRIMARY_FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shortBody)}`;
  };

  const updateCharacterCount = (field) => {
    const limit = Number(field.dataset.maxLength || 0);
    const count = field.closest('.lead-field')?.querySelector('[data-char-count]');
    if (count) count.textContent = String(field.value.length);
    if (limit > 0) {
      field.setAttribute('aria-invalid', field.value.length > limit ? 'true' : 'false');
    }
  };

  const validateSupportedLengths = (form, status) => {
    for (const field of form.querySelectorAll('[data-max-length]')) {
      if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement)) continue;
      const limit = Number(field.dataset.maxLength || FIELD_LIMITS[field.name] || 0);
      field.setCustomValidity('');
      updateCharacterCount(field);
      if (limit > 0 && field.value.length > limit) {
        field.setCustomValidity(`Please keep this field to ${limit.toLocaleString()} characters or fewer. Your text has not been shortened.`);
        setStatus(status, `${field.labels?.[0]?.innerText?.trim() || 'This field'} is ${field.value.length - limit} characters over the supported limit. Your text is still intact—please shorten it before submitting.`, 'error');
        field.focus();
        return false;
      }
    }
    return true;
  };

  const openEmailFallback = (form, status) => {
    if (!validateSupportedLengths(form, status)) {
      form.reportValidity();
      return false;
    }

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
    handoffFallbackRequest(payload, status);
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
      action: TURNSTILE_ACTION,
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

    form.querySelectorAll('[data-max-length]').forEach((field) => {
      if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement)) return;
      updateCharacterCount(field);
      field.addEventListener('input', () => {
        field.setCustomValidity('');
        updateCharacterCount(field);
        const limit = Number(field.dataset.maxLength || FIELD_LIMITS[field.name] || 0);
        if (limit > 0 && field.value.length > limit) {
          field.setCustomValidity(`Please keep this field to ${limit.toLocaleString()} characters or fewer. Your text has not been shortened.`);
        }
      });
    });

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }
    form.dataset.deliveryConfigured = 'unknown';
    form.dataset.turnstileEnabled = 'unknown';
    setStatus(status, 'Checking secure inquiry delivery options...', '');

    runtimeConfigPromise
      .then(async (config) => {
        const deliveryConfigured = Boolean(config && config.delivery && config.delivery.configured === true);
        form.dataset.deliveryConfigured = String(deliveryConfigured);

        if (!deliveryConfigured) {
          form.dataset.turnstileEnabled = 'false';
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
          }
          setStatus(
            status,
            `Secure online delivery is being configured. Submit will preserve your completed request in a text file and open an email draft to ${PRIMARY_FALLBACK_EMAIL}; ${SECONDARY_FALLBACK_EMAIL} is also available.`,
            ''
          );
          return;
        }

        await initializeTurnstile(form, status, config);
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      })
      .catch(() => {
        form.dataset.turnstileEnabled = 'false';
        form.dataset.deliveryConfigured = 'false';
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
        setStatus(
          status,
          `Online delivery could not be verified. Submit will preserve your completed request in a text file and open an email draft to ${PRIMARY_FALLBACK_EMAIL}; ${SECONDARY_FALLBACK_EMAIL} is also available.`,
          ''
        );
      });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (form.dataset.deliveryConfigured === 'unknown') {
        setStatus(status, 'Please wait a moment while secure inquiry delivery is checked.', '');
        return;
      }

      if (form.dataset.deliveryConfigured !== 'true') {
        openEmailFallback(form, status);
        return;
      }

      if (!validateSupportedLengths(form, status)) {
        form.reportValidity();
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
        setStatus(status, 'Please wait a moment while spam protection initializes.', '');
        return;
      }

      if (form.getAttribute('data-form-type') !== 'proposal') {
        emitMeasurement('inquiry_start');
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
          handoffFallbackRequest(payload, status);
          return;
        }

        form.reset();
        form.dataset.turnstileToken = '';
        emitMeasurement(form.getAttribute('data-form-type') === 'proposal' ? 'proposal_success' : 'inquiry_success');
        setStatus(status, 'Submission received. Our team will follow up using your provided contact details.', 'success');
      } catch (_error) {
        const payload = toPayload(form);
        handoffFallbackRequest(payload, status);
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });
  });
})();
