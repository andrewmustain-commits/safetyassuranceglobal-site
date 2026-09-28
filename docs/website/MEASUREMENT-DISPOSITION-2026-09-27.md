# Website Measurement Disposition

Date: 2026-09-27  
Status: Active production boundary

## Decision

Safety Assurance Global uses two deliberately separate measurement layers.

1. **Cloudflare Web Analytics** may provide page- and performance-level browser telemetry when enabled by the Cloudflare platform. The site Content Security Policy permits the approved Cloudflare beacon and collection host.
2. **Safety Assurance Global funnel events** in `public/scripts/site-measurement.js` are **local browser hooks only**. They dispatch allowlisted event names through `CustomEvent` and do not transmit data to an analytics collector.

## Privacy boundary

The local event layer must not transmit or persist:

- names, email addresses, phone numbers, organizations, or IP addresses;
- inquiry or proposal text;
- scope-builder selections or readiness answers;
- Turnstile tokens or browser user-agent strings;
- arbitrary event properties beyond the approved event name.

No external funnel collector is authorized by this record. Connecting these hooks to any external analytics service requires a separate privacy and data-purpose approval.

## Audit reconciliation

The September 27, 2026 website audit identified two distinct issues: a Cloudflare analytics beacon blocked by CSP and custom event hooks with no collector. The CSP is now configured for the approved Cloudflare Web Analytics endpoints. The custom event hooks remain intentionally local-only rather than being silently connected to a third-party collector.

## Acceptance

Production verification should confirm that:

- the CSP permits the approved Cloudflare Web Analytics script and collection endpoint;
- the local measurement runtime contains no `fetch`, `XMLHttpRequest`, `sendBeacon`, storage, or form-content collection path;
- form text and personal data never enter the local event payload.
