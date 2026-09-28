(function () {
  const root = document.querySelector('[data-scope-builder]');
  if (!(root instanceof HTMLElement)) return;

  const form = root.querySelector('[data-scope-builder-form]');
  const result = root.querySelector('[data-scope-result]');
  const staleStatus = root.querySelector('[data-scope-stale-status]');
  const downloadButton = root.querySelector('[data-scope-download]');
  if (!(form instanceof HTMLFormElement) || !(result instanceof HTMLElement)) return;

  let activeBrief = null;

  const recommendations = {
    'Operational Readiness': {
      title: 'Operational Readiness Review',
      outputs: ['Readiness assessment', 'Gap register', 'Corrective-action roadmap', 'Validation report', 'Executive brief']
    },
    'Independent Assurance': {
      title: 'Independent Assurance Review',
      outputs: ['Assurance review', 'Evidence package', 'Gap register', 'Executive dashboard', 'Closeout report']
    },
    'QA/QC and Quality Oversight': {
      title: 'QA/QC & Quality Verification',
      outputs: ['QA/QC review', 'Inspection or verification record', 'Gap register', 'Action tracker', 'Validation report']
    },
    'Contractor Assurance': {
      title: 'Contractor Assurance Review',
      outputs: ['Contractor-assurance report', 'Control/evidence review', 'Gap register', 'Corrective-action roadmap', 'Closeout record']
    },
    'Safety and Risk Management': {
      title: 'Safety & Risk Assurance',
      outputs: ['Risk/control review', 'Gap register', 'Priority action roadmap', 'Verification plan', 'Executive dashboard']
    },
    'Compliance Readiness': {
      title: 'Compliance Readiness Review',
      outputs: ['Readiness assessment', 'Evidence matrix', 'Gap register', 'Corrective-action roadmap', 'Validation report']
    },
    'Incident Investigation': {
      title: 'Incident Investigation & Learning',
      outputs: ['Evidence map', 'Incident learning report', 'Contributing-factor analysis', 'Corrective-action roadmap', 'Closeout validation']
    },
    'Embedded HSE Support': {
      title: 'Embedded HSE Support',
      outputs: ['Field observation record', 'Issue/action tracker', 'Control verification notes', 'Reporting cadence', 'Closeout summary']
    },
    'Emergency Preparedness': {
      title: 'Emergency Preparedness Review',
      outputs: ['Preparedness assessment', 'Exercise or drill findings', 'Gap register', 'Corrective-action roadmap', 'Validation report']
    },
    'Program Assurance': {
      title: 'Program Assurance',
      outputs: ['Program assurance review', 'Cross-workstream risk view', 'Executive dashboard', 'Corrective-action roadmap', 'Closeout report']
    },
    'Training and Workforce Development': {
      title: 'Workforce Development Scoping',
      outputs: ['Role/need analysis', 'Learning pathway recommendation', 'Delivery assumptions', 'Offering-status confirmation', 'Implementation plan']
    }
  };

  const applyPrefill = (name, param) => {
    const value = new URLSearchParams(window.location.search).get(param);
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLSelectElement) || !value) return;
    const allowed = [...field.options].some((option) => option.value === value);
    if (allowed) field.value = value;
  };

  applyPrefill('environment', 'environment');
  applyPrefill('stage', 'stage');
  applyPrefill('need', 'need');
  applyPrefill('outcome', 'outcome');
  applyPrefill('schedule', 'schedule');

  const text = (selector, value) => {
    const node = result.querySelector(selector);
    if (node) node.textContent = value;
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

  const buildScopeBriefText = (brief) => [
    'Safety Assurance Global — Preliminary Scope Brief',
    '',
    'Generated locally from the selection-only Start a Scope tool.',
    '',
    `Recommended starting point: ${brief.title}`,
    `Operating environment: ${brief.environment}`,
    `Lifecycle stage: ${brief.stage}`,
    `Primary need: ${brief.need}`,
    `Decision / output: ${brief.outcome}`,
    `Timing: ${brief.schedule}`,
    '',
    'Typical outputs to discuss:',
    ...brief.outputs.map((item) => `- ${item}`),
    '',
    'Boundary:',
    'This preliminary brief is an informational routing aid, not an assurance conclusion, proposal, availability commitment, qualification decision, regulatory determination, or fixed scope. Final work is defined against the actual requirement and evidence.'
  ].join('\n');

  const invalidateResult = (message = 'Your selections changed. Build the preliminary scope again before continuing.') => {
    activeBrief = null;
    if (result.hidden) return;
    result.hidden = true;
    const proposal = result.querySelector('[data-scope-proposal-link]');
    if (proposal instanceof HTMLAnchorElement) proposal.href = '/request-proposal';
    if (staleStatus) staleStatus.textContent = message;
  };

  const buildProposalHref = ({ environment, stage, need, outcome, schedule, title, outputs }) => {
    const params = new URLSearchParams({
      projectType: environment,
      serviceNeeded: need,
      anticipatedSchedule: schedule,
      briefScope: `Preliminary scope builder result: ${title}. Lifecycle stage: ${stage}. Required decision/output: ${outcome}. Typical outputs to discuss: ${outputs.join(', ')}.`,
      procurementContext: environment === 'Government or Public Infrastructure'
        ? 'Government/public-sector requirement or teaming context — details to be confirmed.'
        : 'Direct commercial or defined project requirement — procurement context to be confirmed.'
    });
    return `/request-proposal?${params.toString()}`;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const environment = String(data.get('environment') || '');
    const stage = String(data.get('stage') || '');
    const need = String(data.get('need') || '');
    const outcome = String(data.get('outcome') || '');
    const schedule = String(data.get('schedule') || '');
    const recommendation = recommendations[need] || {
      title: 'Defined Assurance Scoping Discussion',
      outputs: ['Defined scope', 'Evidence requirements', 'Gap/action structure', 'Reporting expectations']
    };

    activeBrief = {
      title: recommendation.title,
      environment,
      stage,
      need,
      outcome,
      schedule,
      outputs: [...recommendation.outputs]
    };

    text('[data-result-title]', recommendation.title);
    text('[data-result-summary]', `A practical starting point is ${recommendation.title}. Safety Assurance Global would confirm the actual requirement, acceptance criteria, evidence, jurisdiction, resources, and schedule before proposing work.`);
    text('[data-result-environment]', environment);
    text('[data-result-stage]', stage);
    text('[data-result-need]', need);
    text('[data-result-outcome]', outcome);
    text('[data-result-schedule]', schedule);

    const list = result.querySelector('[data-result-outputs]');
    if (list) {
      list.replaceChildren(...recommendation.outputs.map((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      }));
    }

    const proposal = result.querySelector('[data-scope-proposal-link]');
    if (proposal instanceof HTMLAnchorElement) {
      proposal.href = buildProposalHref({ environment, stage, need, outcome, schedule, title: recommendation.title, outputs: recommendation.outputs });
    }

    if (staleStatus) staleStatus.textContent = '';
    result.hidden = false;
    window.dispatchEvent(new CustomEvent('sag:site-event', { detail: { name: 'scope_builder_complete' } }));
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  if (downloadButton instanceof HTMLButtonElement) {
    downloadButton.addEventListener('click', () => {
      if (!activeBrief || result.hidden) return;
      downloadTextFile('safety-assurance-global-preliminary-scope.txt', buildScopeBriefText(activeBrief));
      window.dispatchEvent(new CustomEvent('sag:site-event', { detail: { name: 'resource_download' } }));
    });
  }

  form.addEventListener('change', () => invalidateResult());

  form.addEventListener('reset', () => {
    activeBrief = null;
    result.hidden = true;
    if (staleStatus) staleStatus.textContent = '';
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted && !result.hidden) {
      invalidateResult('This page was restored from browser history. Rebuild the preliminary scope to confirm the current selections.');
    }
  });
})();
