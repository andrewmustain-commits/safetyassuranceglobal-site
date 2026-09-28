# Customer Experience Architecture

Date: 2026-09-27  
Status: Production architecture / governed public experience

## Objective

Safety Assurance Global's public website is designed as a customer decision-and-engagement system rather than a collection of organizational pages.

The intended customer progression is:

**Discover → Diagnose → Prove → Scope → Engage**

The public site must make that progression easy without inventing performance, collecting unnecessary personal information, or blurring authority boundaries.

## Customer Modes

### 1. I have a problem

Primary routes:

- `/start` — guided preliminary scope builder
- `/readiness-check` — browser-only evidence-visibility snapshot
- service and industry pages — contextual entry into a defined scope

The customer should not need to understand Safety Assurance Global's internal service taxonomy before identifying a useful next step.

### 2. I am evaluating Safety Assurance Global

Primary routes:

- `/proof` — Evidence & Results Center
- `/sample-deliverables` — sanitized work-product structures
- `/service-sheets` — buyer-facing service summaries
- `/method` — evidence standard
- `/engagement-examples` — clearly labeled illustrative scenarios
- `/leadership` — named business and technical accountability
- `/capabilities` — corporate capability profile

### 3. I am a government buyer or partner

Primary routes:

- `/government` — Government Acquisition Center
- `/partners` — prime contractor / subcontract / teaming path
- current public capability statement download
- `/request-proposal` — defined procurement or teaming intake

Government identifiers, qualification language, status claims, and opportunity-specific evidence remain subject to the public claims register and current evidence.

### 4. I am ready to engage

Primary routes:

- `/start` — build the preliminary scope
- `/request-proposal` — provide the defined operating, schedule, location, outcome, and procurement context
- `/contact` — discuss a requirement before a proposal is appropriate

The scope builder carries only user-selected, non-personal scoping context into the proposal form. The customer reviews and edits that context before submission.

## Customer Resources

`/resources` provides practical, no-login tools and generic working templates:

- Readiness Evidence Matrix
- Corrective-Action Register
- Contractor Readiness Checklist
- QA/QC Verification Log

These files are generic starting structures. They are not customer records, legal advice, regulatory forms, assurance conclusions, certifications, or substitutes for applicable requirements.

## Readiness Snapshot Boundary

The readiness snapshot:

- runs entirely in the browser;
- does not request name, email, project identifier, or project-sensitive free text;
- does not transmit or store answers;
- reports an evidence-visibility pattern rather than a numerical readiness score;
- is not an audit, assurance opinion, compliance decision, certification, regulatory determination, or go/no-go decision.

## Persistent Customer Pathfinder

The customer pathfinder is available throughout the public experience as a closed-by-default native browser disclosure control.

It routes visitors to:

- Start a Scope
- Customer Resources
- Evidence & Results
- Government
- Prime / Teaming
- Proposal Request
- Institute information
- human contact

It does not accept questions, prompts, personal information, or unverified claims.

## Measurement Boundary

Measurement is privacy-safe and event-name-only.

Allowed customer-journey measurement may record only an approved event name, such as:

- page-path view;
- scope-builder completion;
- readiness-snapshot completion;
- generic resource download;
- capability-statement download;
- form start / success;
- assistant open / human handoff.

The measurement layer must not include:

- names;
- email addresses;
- phone numbers;
- form fields;
- inquiry text;
- proposal text;
- scope-builder selections;
- readiness answers;
- query-string values;
- Turnstile tokens;
- user-agent strings;
- assistant content.

No external analytics destination is introduced by this architecture.

## Truth Rules

The public experience must not:

- invent a customer;
- invent a case study;
- imply an unnamed customer engagement occurred;
- invent an award or agency relationship;
- convert prior individual experience into corporate past performance;
- imply universal qualification, licensure, accreditation, approval, certification, or availability;
- activate Institute authority because a corporate marketing route exists;
- represent a preliminary self-assessment as formal assurance.

Illustrative scenarios must be labeled as illustrative and not customer records.

## Future Gated Layer

A future authenticated customer workspace could support engagement status, evidence requests, findings, corrective actions, due dates, documents, closeout, and executive reporting.

That capability is **not part of the current public-site authority** and must not be represented as available until separately designed, secured, qualified, and authorized.

## Non-Regression Contract

CI validates:

- required buyer routes exist;
- the homepage links to scope, proof, resources, and readiness paths;
- the Proof Center connects to deliverables, service sheets, method, capabilities, illustrative engagements, and leadership;
- Government connects to capabilities, teaming, and resources;
- Resources connect to tools and buyer materials;
- the scope builder and readiness snapshot retain their governed controls;
- proposal carry-forward remains available;
- the persistent customer pathfinder is present;
- journey measurement events remain in the approved event-only model.

This contract is implemented by `scripts/validate-customer-journeys.mjs` together with the existing measurement-privacy, public-UX, claims-governance, metadata, sitemap, security, CodeQL, deployment, and Lighthouse gates.
