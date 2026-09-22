# Institute of Assurance Operating System — B1–B13 Architecture Specification

**Status:** APPROVED ARCHITECTURE / IMPLEMENTATION STARTING / FAIL-CLOSED  
**Implementation issue:** #89  
**Implementation branch:** `build/institute-os-b1-b13`

## Authority and implementation status

This document records the approved architecture before engineering implementation. It is not evidence that any control is already implemented, deployed, verified, or authorized.

Required status progression:

**DESIGNED → APPROVED → IMPLEMENTED → TESTED → DEPLOYED → VERIFIED → AUTHORIZED**

No stage may be represented as a later stage without evidence.

## B1–B13 architecture

1. **B1 — Identity & Authorization:** every privileged action has an attributable actor, role, authority basis, resource scope, and authorization decision.
2. **B2 — State & Lifecycle:** controlled objects move only through explicit, authorized state transitions with immutable transition events.
3. **B3 — Evidence & Institutional Events:** material actions produce attributable events and linked evidence; decisions remain distinct from evidence.
4. **B4 — Assessment & Competency:** competencies map to objectives, assessments, performance evidence, and competency decisions.
5. **B5 — Credential Governance & Issuance:** completion does not equal eligibility; eligibility does not equal issuance; issuance requires authority and Registrar control.
6. **B6 — Credential Verification & Public Trust:** public verification reports authoritative Registrar state and fails closed when integrity cannot be established.
7. **B7 — Program & Course Release:** programs/courses progress through controlled review and release states; public availability is separately authorized.
8. **B8 — Institutional Course Factory™:** content production is separated from institutional release authority; AI-assisted production remains reviewable and provenance-aware.
9. **B9 — Gate B & Launch Control:** operational capabilities are independently gated; withheld capabilities cannot be activated through UI/API shortcuts.
10. **B10 — Institutional Operations & Control Plane:** governance, assurance, programs, learners, credentials, evidence, risk, and system health are brought together without collapsing authority boundaries.
11. **B11 — Data Architecture & System of Record:** each institutional domain has a defined authoritative source; derived systems cannot silently become authorities.
12. **B12 — Security, Privacy & Trust:** least privilege, protected secrets, learner-data minimization, assessment security, credential security, audit integrity, and incident response.
13. **B13 — Integration & API Architecture:** explicit interfaces, server-side authorization, state-aware commands, idempotency, failure handling, versioning, and controlled external integrations.

## Core institutional chain

**Authority → State → Evidence → Competency → Eligibility → Issuance → Registrar → Verification**

## Core production chain

**Authoritative Sources → Institutional Course Factory™ → Curriculum → Competency → Assessment → Human Review/QA → B7 Release Authorization → Academy Runtime → Learner Performance → Credential Eligibility → Issuance Authority → Registrar → Public Verification**

## System-of-record rule

The public website is a presentation and routing layer. It is not authoritative for:

- Human G2
- governance decisions
- learner evidence
- assessment authority
- Registrar records
- credential issuance
- release authority
- institutional evidence

## Launch fail-closed rules

The implementation must not activate:

- public enrollment
- live commerce
- credential issuance
- Registrar public authority
- public credential verification
- regulated-program claims
- accreditation/government approval claims
- production DNS cutover

unless the applicable independent authority gate has been satisfied.

## Repository implementation guardrails

- Preserve existing production qualification work.
- Use an isolated implementation branch.
- Prefer small, reviewable commits.
- Add automated tests for each control boundary.
- Generate evidence from actual test/runtime results; do not fabricate successful output.
- Do not commit secrets.
- Do not modify production DNS as part of this architecture build.
- Do not merge to `main` solely because architecture has been approved.
- Do not treat a schema, API, UI, or feature as authoritative until its authority boundary is implemented and verified.

## Initial engineering sequence

### Phase I — Foundation
- canonical IDs
- data contracts
- authorization primitives
- state machine primitives
- institutional event model
- evidence/decision relationships

### Phase II — Credential chain
- competency registry
- assessment records
- eligibility engine
- credential registry
- Registrar boundary
- verification service

### Phase III — Release and production
- program/course release engine
- Course Factory interface
- Gate B capability controls
- control-plane views

### Phase IV — Trust and integration
- system-of-record enforcement
- security/privacy controls
- API gateway/service boundaries
- idempotency/retry/reconciliation
- automated assurance tests

### Phase V — Controlled verification
- build validation
- integration testing
- security testing
- state-transition testing
- evidence-integrity testing
- recovery testing
- controlled runtime deployment
- human verification

## Existing deferred controls

The existing deferred Institute issues remain controlling for public launch readiness:

- Issue #75 — Deferred launch integration — Institute public website
- Issue #76 — Deferred launch readiness register — Institute nontechnical blockers

This implementation program does not override those deferred/failed-closed postures.

## Definition of done for architecture implementation

The B1–B13 architecture is not considered implemented merely because files or database tables exist.

Implementation requires:

1. control exists in code/configuration;
2. authorized and unauthorized paths are tested;
3. events/evidence are generated where required;
4. failure states are observable;
5. recovery behavior is tested where applicable;
6. implementation evidence is preserved;
7. deployment is verified in the intended runtime;
8. the applicable human authority accepts the result.

