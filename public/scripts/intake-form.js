(function () {
  const forms = document.querySelectorAll('[data-intake-form]');

  const MAX_MESSAGE_LENGTH = 3000;

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

  const toPayload = (form) => {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.formType = form.getAttribute('data-form-type') || 'contact';
    payload.userAgent = navigator.userAgent;

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

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

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

      setStatus(status, 'Submitting your inquiry...', '');

      try {
        const payload = toPayload(form);
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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
        setStatus(status, 'Submission received. Our team will follow up using your provided contact details.', 'success');
      } catch (_error) {
        setStatus(status, 'Submission is currently unavailable. Please email contact@safetyassuranceglobal.com.', 'error');
      }
    });
  });
})();
