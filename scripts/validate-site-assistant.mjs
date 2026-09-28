import fs from 'node:fs';

const component = fs.readFileSync('src/components/ui/SiteAssistant.astro', 'utf8');
const layout = fs.readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const measurement = fs.readFileSync('public/scripts/site-measurement.js', 'utf8');
const required = [
  [component, 'data-site-assistant'],
  [component, 'data-assistant-action="handoff"'],
  [component, 'Move directly to the right customer path. This helper uses only verified public routes and does not collect questions or personal information.'],
  [component, 'https://institute.safetyassuranceglobal.com'],
    [layout, '<SiteAssistant />'],
  [measurement, "emit('assistant_open')"],
  [measurement, "emit('assistant_handoff')"]
];
for (const [source, marker] of required) if (!source.includes(marker)) throw new Error(`Assistant governance marker missing: ${marker}`);
const forbidden = ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'innerHTML', 'eval(', 'new Function'];
for (const marker of forbidden) {
  if (component.includes(marker)) throw new Error(`Assistant component contains forbidden runtime behavior: ${marker}`);
  if (measurement.includes(marker)) throw new Error(`Assistant measurement contains forbidden runtime behavior: ${marker}`);
}
const allowedActions = ['scope', 'proof', 'government', 'partners', 'proposal', 'institute', 'handoff'];
const actions = [...component.matchAll(/data-assistant-action="([^"]+)"/g)].map((match) => match[1]);
for (const action of actions) if (!allowedActions.includes(action)) throw new Error(`Unapproved assistant action: ${action}`);
if (new Set(actions).size !== allowedActions.length || actions.length !== allowedActions.length) throw new Error('Assistant action set must exactly match the governed allowlist.');
console.log('Website assistant governance validation passed.');
