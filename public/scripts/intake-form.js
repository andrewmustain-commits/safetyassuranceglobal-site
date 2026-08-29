(function () {
  const forms = document.querySelectorAll('[data-intake-form]');

  const MAX_MESSAGE_LENGTH = 3000;
  const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
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
        : 'Spam protection configuration could not be verified.';
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

    runtimeConfigPromise
      .then((config) => initializeTurnstile(form, status, config))
      .catch((error) => {
        form.dataset.turnstileEnabled = 'unknown';
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = true;
        }
        setStatus(
          status,
          error instanceof Error
            ? `${error.message} Please email contact@safetyassuranceglobal.com.`
            : 'Spam protection is unavailable. Please email contact@safetyassuranceglobal.com.',
          'error'
        );
      });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

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
        setStatus(status, 'Spam protection is unavailable. Please email contact@safetyassuranceglobal.com.', 'error');
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
          const message = result && typeof result.message === 'string'
            ? result.message
            : 'Submission could not be completed. Please email contact@safetyassuranceglobal.com.';
          setStatus(status, message, 'error');
          return;
        }

        form.reset();
        form.dataset.turnstileToken = '';
        setStatus(status, 'Submission received. Our team will follow up using your provided contact details.', 'success');
      } catch (_error) {
        setStatus(status, 'Submission is currently unavailable. Please email contact@safetyassuranceglobal.com.', 'error');
      } finally {
        if (submitButton instanceof HTMLButtonElement && form.dataset.turnstileEnabled !== 'unknown') {
          submitButton.disabled = false;
        }
      }
    });
  });
})();
