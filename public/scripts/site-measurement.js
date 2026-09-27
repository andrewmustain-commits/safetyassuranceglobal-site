(function () {
  const allowedEvents = new Set([
    'service_view',
    'capability_view',
    'government_view',
    'contact_start',
    'inquiry_start',
    'inquiry_success',
    'proposal_start',
    'proposal_success',
    'capability_statement_download',
    'assistant_open',
    'assistant_handoff'
  ]);

  const emit = (name) => {
    if (!allowedEvents.has(name)) return;
    window.dispatchEvent(new CustomEvent('sag:measurement', { detail: { name } }));
  };

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/services' || path.startsWith('/services/')) emit('service_view');
  if (path === '/capabilities') emit('capability_view');
  if (path === '/government') emit('government_view');

  document.addEventListener('focusin', (event) => {
    const form = event.target instanceof Element ? event.target.closest('[data-intake-form]') : null;
    if (!form || form.dataset.measurementStarted === 'true') return;
    form.dataset.measurementStarted = 'true';
    emit(form.getAttribute('data-form-type') === 'proposal' ? 'proposal_start' : 'contact_start');
  });

  document.addEventListener('sag:intake-event', (event) => {
    const name = event instanceof CustomEvent && event.detail && event.detail.name;
    if (typeof name === 'string') emit(name);
  });

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('safety-assurance-global-capability-statement') && href.toLowerCase().endsWith('.pdf')) {
      emit('capability_statement_download');
    }
  });
})();
