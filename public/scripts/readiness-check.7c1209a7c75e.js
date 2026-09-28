(function () {
  const form = document.querySelector('[data-readiness-assessment]');
  const result = document.querySelector('[data-readiness-result]');
  const staleStatus = document.querySelector('[data-readiness-stale-status]');
  const downloadButton = document.querySelector('[data-readiness-download]');
  if (!(form instanceof HTMLFormElement) || !(result instanceof HTMLElement)) return;

  let activeSnapshot = null;

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

  const focusNeedByDomain = {
    requirements: 'Operational Readiness',
    evidence: 'Independent Assurance',
    ownership: 'Program Assurance',
    contractors: 'Contractor Assurance',
    field: 'Operational Readiness',
    quality: 'QA/QC and Quality Oversight',
    emergency: 'Emergency Preparedness',
    change: 'Program Assurance',
    closure: 'Independent Assurance',
    leadership: 'Program Assurance'
  };

  const state = (value) => {
    if (value >= 3) return 'Evidence visible';
    if (value === 2) return 'Partially visible';
    if (value === 1) return 'Material gaps';
    return 'Not yet verified';
  };

  const downloadTextFile = (filename, body) => {
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const buildSnapshotText = (snapshot) => [
    'Safety Assurance Global — Preliminary Readiness Snapshot',
    '',
    'Generated locally from the browser-based readiness tool.',
    '',
    snapshot.title,
    snapshot.summary,
    '',
    'Evidence visibility by domain:',
    ...snapshot.domains.map((item) => `- ${item.label}: ${item.state}`),
    '',
    snapshot.focus,
    '',
    'Boundary:',
    'This is an informational self-assessment, not an audit, certification, assurance opinion, compliance determination, regulatory finding, or go/no-go decision. A formal conclusion requires a defined scope and review of actual evidence.'
  ].join('\n');

  const invalidateResult = (message = 'Your answers changed. Recompute the snapshot before using the result or continuing to scope.') => {
    activeSnapshot = null;
    if (result.hidden) return;
    result.hidden = true;
    const scopeLink = result.querySelector('[data-readiness-scope-link]');
    if (scopeLink instanceof HTMLAnchorElement) {
      scopeLink.href = '/start';
      scopeLink.textContent = 'Build an Assurance Scope';
    }
    if (staleStatus) staleStatus.textContent = message;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const entries = Object.keys(labels).map((key) => [key, Number(data.get(key))]);
    const counts = entries.reduce((acc, entry) => {
      const value = entry[1];
      if (value >= 3) acc.visible += 1;
      else if (value === 2) acc.partial += 1;
      else if (value === 1) acc.gaps += 1;
      else acc.unknown += 1;
      return acc;
    }, { visible: 0, partial: 0, gaps: 0, unknown: 0 });

    let title = 'Evidence visibility needs focused review';
    let summary = 'Several areas are unknown, incomplete, or not yet supported by visible evidence. A focused review can help establish what is required before the decision point.';
    if (counts.visible >= 8 && counts.gaps === 0 && counts.unknown === 0) {
      title = 'Evidence visibility appears comparatively strong';
      summary = 'Most areas are reported as supported by current evidence. The remaining value is in testing whether the evidence is complete, current, and sufficient for the actual decision.';
    } else if ((counts.gaps + counts.unknown) <= 3) {
      title = 'Readiness evidence is mixed';
      summary = 'Some controls and evidence appear visible, while several areas still depend on incomplete follow-through or verification. Prioritize the weakest areas before the decision point.';
    }

    const titleNode = result.querySelector('[data-readiness-title]');
    const summaryNode = result.querySelector('[data-readiness-summary]');
    const domains = result.querySelector('[data-readiness-domains]');
    const focusNode = result.querySelector('[data-readiness-focus]');
    const scopeLink = result.querySelector('[data-readiness-scope-link]');

    const minimumVisibility = Math.min(...entries.map((entry) => entry[1]));
    const focusDomain = entries.find((entry) => entry[1] === minimumVisibility)?.[0];
    const focusNeed = focusNeedByDomain[focusDomain] || 'Operational Readiness';

    if (titleNode) titleNode.textContent = title;
    if (summaryNode) {
      summaryNode.textContent = summary + ' Pattern: ' +
        counts.visible + ' evidence visible, ' +
        counts.partial + ' partially visible, ' +
        counts.gaps + ' material gaps, ' +
        counts.unknown + ' not yet verified.';
    }

    if (focusNode) {
      focusNode.textContent = `Suggested starting path: ${focusNeed}. This routing suggestion is based only on one of the least-visible evidence areas you selected and is not a formal assurance recommendation.`;
    }

    activeSnapshot = {
      title,
      summary: summary + ' Pattern: ' +
        counts.visible + ' evidence visible, ' +
        counts.partial + ' partially visible, ' +
        counts.gaps + ' material gaps, ' +
        counts.unknown + ' not yet verified.',
      domains: entries.map(([key, value]) => ({ label: labels[key], state: state(value) })),
      focus: `Suggested starting path: ${focusNeed}. This routing suggestion is based only on one of the least-visible evidence areas you selected and is not a formal assurance recommendation.`
    };

    if (scopeLink instanceof HTMLAnchorElement) {
      scopeLink.href = `/start?need=${encodeURIComponent(focusNeed)}`;
      scopeLink.textContent = `Build a ${focusNeed} Scope`;
    }

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

    if (staleStatus) staleStatus.textContent = '';
    result.hidden = false;
    window.dispatchEvent(new CustomEvent('sag:site-event', { detail: { name: 'readiness_snapshot_complete' } }));
    result.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  if (downloadButton instanceof HTMLButtonElement) {
    downloadButton.addEventListener('click', () => {
      if (!activeSnapshot || result.hidden) return;
      downloadTextFile('safety-assurance-global-readiness-snapshot.txt', buildSnapshotText(activeSnapshot));
      window.dispatchEvent(new CustomEvent('sag:site-event', { detail: { name: 'resource_download' } }));
    });
  }

  form.addEventListener('change', () => invalidateResult());

  form.addEventListener('reset', () => {
    activeSnapshot = null;
    result.hidden = true;
    if (staleStatus) staleStatus.textContent = '';
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted && !result.hidden) {
      invalidateResult('This page was restored from browser history. Recompute the snapshot to confirm the current answers.');
    }
  });
})();