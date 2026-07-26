# PHASE-2-DECISION-LOG

Date: 2026-07-26
Repository: andrewmustain-commits/safetyassuranceglobal-site
Branch: website/public-site-full-refresh

## Decision 1: SAG Command Public Treatment

- Topic: Public treatment of SAG Command
- Working disposition: Conservative public status implemented as In Development.
- Public route: /sag-command
- Public CTA: Discuss an Assurance Technology Pilot
- Controls applied:
  - No commercial production availability claim
  - No architecture, credentials, internal URLs, integrations, security diagrams, or private workflow details
  - Distinguishes current functionality, controlled-pilot functionality, in-development functionality, and future concepts
- Legacy handling: /command retained as a compatibility route and redirected to /sag-command in edge redirects.

## Decision 2: Academy Versus Training Route Architecture

- Topic: Academy versus Training route architecture
- Working disposition: Consolidate public training architecture under /training and /maritime-training.
- Public treatment:
  - Training is explicitly subordinate to consulting and independent assurance services.
  - Academy-first messaging is removed from primary navigation and primary CTA flow.
- Legacy handling: /academy redirected to /training in edge redirects.

## Decision 3: Government Claims Threshold

- Topic: Government claims threshold
- Working disposition: Conservative threshold applied.
- Public rule:
  - Allow only capability-oriented, non-endorsed, non-award, non-authority language.
  - Disallow implied agency endorsement, contract award assertions, regulatory authority assertions, and unsupported performance claims.
- Implementation control: Government and maritime-government language includes qualification notices and evidence-safe framing.

## Decision 4: infrastructure-of-integrity Content

- Topic: infrastructure-of-integrity content
- Working disposition: Keep as draft content and not publicly routed.
- Public rule:
  - Do not publish route or claims until executive/legal review and substantiation package are complete.
  - Maintain hold posture documented in Phase 1 registers.

## Decision 5: Immediate Service-Page Depth

- Topic: immediate service-page depth
- Working disposition: Parent-route depth with structured maritime and method detail in Phase 2.
- Included now:
  - Home, Maritime, Method, Training, Maritime Training, and conservative SAG Command page
  - Services remains parent-level with grouped customer-problem and output framing
- Deferred to future phases (pending validated content depth):
  - Service child-route expansion under /services/*
  - Industry child-route expansion under /industries/*

## Conservative-Mode Statement

Where executive evidence was not available, conservative public treatment was selected and implemented.
