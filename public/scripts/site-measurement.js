(function () {
  const allowedEvents = new Set([
    'service_view',
    'capability_view',
    'government_view',
    'scope_view',
    'proof_view',
    'resources_view',
    'readiness_view',
    'partners_view',
    'engagement_examples_view',
    'leadership_view',
    'scope_builder_complete',
    'readiness_snapshot_complete',
    'resource_download',
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
  if (path === '/start') emit('scope_view');
  if (path === '/proof') emit('proof_view');
  if (path === '/resources') emit('resources_view');
  if (path === '/readiness-check') emit('readiness_view');
  if (path === '/partners') emit('partners_view');
  if (path === '/engagement-examples') emit('engagement_examples_view');
  if (path === '/leadership') emit('leadership_view');

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

  window.addEventListener('sag:site-event', (event) => {
    const name = event instanceof CustomEvent && event.detail && event.detail.name;
    if (typeof name === 'string') emit(name);
  });

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('safety-assurance-global-capability-statement') && href.toLowerCase().endsWith('.pdf')) {
      emit('capability_statement_download');
      return;
    }
    if (href.startsWith('/downloads/') && !href.toLowerCase().endsWith('.pdf')) {
      emit('resource_download');
    }
  });
  const assistant = document.querySelector('[data-site-assistant]');
  if (assistant) {
    let assistantSeen = false;
    const markAssistantOpen = () => {
      if (assistantSeen) return;
      assistantSeen = true;
      emit('assistant_open');
    };
    assistant.addEventListener('focusin', markAssistantOpen, { once: true });
    assistant.addEventListener('pointerdown', markAssistantOpen, { once: true });
    assistant.querySelectorAll('[data-assistant-action]').forEach((link) => {
      link.addEventListener('click', () => {
        if (link.getAttribute('data-assistant-action') === 'handoff') emit('assistant_handoff');
      });
    });
  }

})();
