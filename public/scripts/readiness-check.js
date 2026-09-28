(function () {
  const form = document.querySelector('[data-readiness-assessment]');
  const result = document.querySelector('[data-readiness-result]');
  if (!(form instanceof HTMLFormElement) || !(result instanceof HTMLElement)) return;

  const labels = {
    requirements: 'Requirements',
    evidence: 'Evidence',
    ownership: 'Action ownership',
    contractors: 'Contractor assurance',
    field: 'Field verification',
    quality: 'Quality controls',
    emergency: 'Emergency preparedness',
    change: 'Change / exceptions',
    closure: 'Closure validation',
    leadership: 'Leadership visibility'
  };

  const state = (value) => {
    if (value >= 3) return 'Evidence visible';
    if (value === 2) return 'Partially visible';
    if (value === 1) return 'Material gaps';
    return 'Not yet verified';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const entries = Object.keys(labels).map((key) => [key, Number(data.get(key))]);
    const score = entries.reduce((sum, entry) => sum + entry[1], 0);
    const max = entries.length * 3;
    const percent = Math.round((score / max) * 100);

    let title = 'Evidence visibility needs focused review';
    let summary = 'Several areas are unknown, incomplete, or not yet supported by visible evidence. A focused review can help establish what is required before the decision point.';
    if (percent >= 80) {
      title = 'Evidence visibility appears comparatively strong';
      summary = 'Most areas are reported as supported by current evidence. The remaining value is in testing whether the evidence is complete, current, and sufficient for the actual decision.';
    } else if (percent >= 55) {
      title = 'Readiness evidence is mixed';
      summary = 'Some controls and evidence appear visible, while several areas still depend on incomplete follow-through or verification. Prioritize the weakest areas before the decision point.';
    }

    const titleNode = result.querySelector('[data-readiness-title]');
    const summaryNode = result.querySelector('[data-readiness-summary]');
    const meter = result.querySelector('[data-readiness-meter]');
    const domains = result.querySelector('[data-readiness-domains]');

    if (titleNode) titleNode.textContent = title;
    if (summaryNode) summaryNode.textContent = summary + ' Snapshot index: ' + percent + '%.';
    if (meter instanceof HTMLElement) meter.style.width = percent + '%';

    if (domains) {
      domains.replaceChildren(...entries.map(([key, value]) => {
        const wrapper = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = labels[key];
        dd.textContent = state(value);
        wrapper.append(dt, dd);
        return wrapper;
      }));
    }

    result.hidden = false;
    window.dispatchEvent(new CustomEvent('sag:site-event', { detail: { name: 'readiness_snapshot_complete' } }));
    result.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  form.addEventListener('reset', () => {
    result.hidden = true;
  });
})();