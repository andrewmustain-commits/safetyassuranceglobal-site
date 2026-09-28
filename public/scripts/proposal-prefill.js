(function () {
  const form = document.getElementById('proposal-form');
  if (!(form instanceof HTMLFormElement)) return;

  const params = new URLSearchParams(window.location.search);
  if ([...params.keys()].length === 0) return;

  const setSelect = (name, param) => {
    const value = params.get(param);
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLSelectElement) || !value) return;
    const allowed = [...field.options].some((option) => option.value === value);
    if (allowed) field.value = value;
  };

  const setText = (name, param, maxLength) => {
    const value = params.get(param);
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !value) return;
    field.value = value.slice(0, maxLength);
  };

  setSelect('projectType', 'projectType');
  setSelect('serviceNeeded', 'serviceNeeded');
  setSelect('anticipatedSchedule', 'anticipatedSchedule');
  setText('briefScope', 'briefScope', 3000);
  setText('procurementContext', 'procurementContext', 3000);

  const hasPrefill = ['projectType', 'serviceNeeded', 'anticipatedSchedule', 'briefScope', 'procurementContext']
    .some((key) => params.has(key));
  if (hasPrefill) {
    const status = form.querySelector('[data-form-status]');
    if (status && !status.textContent) {
      status.textContent = 'Preliminary scope details were carried forward. Review and edit them before submitting.';
    }
  }
})();
