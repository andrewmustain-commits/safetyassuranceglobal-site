export type ServiceDetail = {
  slug:
    | 'operational-readiness'
    | 'independent-assurance'
    | 'maritime-compliance'
    | 'qa-qc'
    | 'contractor-assurance'
    | 'safety-risk-management'
    | 'incident-investigation'
    | 'embedded-hse-support'
    | 'emergency-preparedness'
    | 'program-assurance';
  title: string;
  summary: string;
  customerProblem: string;
  audience: string[];
  scopeOfWork: string[];
  engagementProcess: string[];
  evidenceReviewed: string[];
  deliverables: string[];
  expectedResult: string;
  relatedServices: { href: string; label: string }[];
  trainingLink: { href: string; label: string };
  cta: { href: string; label: string };
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'operational-readiness',
    title: 'Operational Readiness',
    summary: 'Readiness reviews that verify controls, execution posture, and decision support before critical operations.',
    customerProblem: 'Teams need confidence that operations can execute safely and consistently under real-world constraints.',
    audience: ['Operations leaders', 'Program managers', 'Port and shipyard leadership', 'Prime-contractor execution teams'],
    scopeOfWork: ['Current-state readiness assessment', 'Control and workflow review', 'Critical-path risk identification', 'Readiness validation checkpoints'],
    engagementProcess: ['Discover context and mission priorities', 'Assess current controls and dependencies', 'Prioritize high-impact readiness actions', 'Validate completion against acceptance criteria'],
    evidenceReviewed: ['Readiness plans and procedures', 'Work-pack and handover records', 'Training and competency artifacts', 'Incident and corrective-action history'],
    deliverables: ['Readiness assessment', 'Gap register', 'Readiness score', 'Corrective-action roadmap', 'Validation report'],
    expectedResult: 'Clearer go/no-go decision support and a prioritized readiness improvement path.',
    relatedServices: [
      { href: '/services/independent-assurance', label: 'Independent Assurance' },
      { href: '/services/program-assurance', label: 'Program Assurance' }
    ],
    trainingLink: { href: '/training', label: 'Readiness-aligned workforce training' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'independent-assurance',
    title: 'Independent Assurance',
    summary: 'Evidence-first independent review to improve confidence in control performance and operational claims.',
    customerProblem: 'Leadership needs objective confirmation of what is in place, what is missing, and what requires action.',
    audience: ['Executives', 'Risk and assurance leaders', 'Program governance teams', 'Public-infrastructure owners'],
    scopeOfWork: ['Assurance planning and scope definition', 'Evidence quality and traceability review', 'Control-effectiveness analysis', 'Findings prioritization'],
    engagementProcess: ['Define assurance scope and decision needs', 'Collect and verify evidence', 'Evaluate control effectiveness', 'Issue assurance outputs and action roadmap'],
    evidenceReviewed: ['Policies and procedures', 'Operational records', 'Control test artifacts', 'Corrective-action and closeout records'],
    deliverables: ['Assurance review', 'Assurance case', 'Evidence package', 'Executive dashboard', 'Closeout report'],
    expectedResult: 'Improved confidence and governance visibility without overstating certainty or outcomes.',
    relatedServices: [
      { href: '/services/operational-readiness', label: 'Operational Readiness' },
      { href: '/services/program-assurance', label: 'Program Assurance' }
    ],
    trainingLink: { href: '/training', label: 'Assurance-support training pathways' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'maritime-compliance',
    title: 'Maritime Compliance',
    summary: 'Compliance-readiness support focused on operational controls, documentation quality, and verification discipline.',
    customerProblem: 'Maritime operators and contractors often face compliance pressure with uneven evidence and control maturity.',
    audience: ['Shipyards', 'Ports and marine terminals', 'Vessel operators', 'Marine contractors'],
    scopeOfWork: ['Compliance-readiness baseline review', 'Control and document structure improvement', 'Readiness checkpoint design', 'Verification support'],
    engagementProcess: ['Baseline current compliance-readiness posture', 'Identify high-risk documentation and control gaps', 'Implement improvement and evidence structure', 'Validate readiness at agreed checkpoints'],
    evidenceReviewed: ['Operating procedures', 'Inspection and audit records', 'Training and role-assignment artifacts', 'Corrective-action and exception logs'],
    deliverables: ['Readiness assessment', 'Evidence package', 'Gap register', 'Corrective-action roadmap', 'Validation report'],
    expectedResult: 'More defensible compliance-readiness posture and stronger audit/oversight preparation.',
    relatedServices: [
      { href: '/services/qa-qc', label: 'QA/QC' },
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' }
    ],
    trainingLink: { href: '/maritime-training', label: 'Maritime compliance training support' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'qa-qc',
    title: 'QA/QC',
    summary: 'Quality-assurance and quality-control reviews that improve consistency, traceability, and field confidence.',
    customerProblem: 'Programs struggle when quality controls are inconsistent across teams, contractors, and sites.',
    audience: ['Project owners', 'Construction and marine program leads', 'Field quality managers', 'Contract administrators'],
    scopeOfWork: ['QA/QC framework review', 'Field verification sampling', 'Nonconformance trend analysis', 'Corrective-action alignment'],
    engagementProcess: ['Review QA/QC intent and acceptance criteria', 'Verify implementation in field and records', 'Identify recurring breakdown patterns', 'Prioritize quality-control remediation'],
    evidenceReviewed: ['Inspection and test records', 'Quality plans and procedures', 'Nonconformance records', 'Corrective-action closure evidence'],
    deliverables: ['QA/QC review', 'Gap register', 'Contractor assurance report', 'Validation report', 'Executive dashboard'],
    expectedResult: 'More reliable quality-control execution and clearer evidence for leadership and stakeholders.',
    relatedServices: [
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' },
      { href: '/services/program-assurance', label: 'Program Assurance' }
    ],
    trainingLink: { href: '/training', label: 'Quality and verification training support' },
    cta: { href: '/request-proposal', label: 'Request a Proposal' }
  },
  {
    slug: 'contractor-assurance',
    title: 'Contractor Assurance',
    summary: 'Assurance support for contractor control, performance evidence, and risk-based oversight.',
    customerProblem: 'Owners and primes need objective visibility into contractor controls and delivery consistency.',
    audience: ['Prime contractors', 'Owner representatives', 'Program governance teams', 'Procurement stakeholders'],
    scopeOfWork: ['Contractor-control review', 'Performance-evidence verification', 'Oversight model assessment', 'Corrective-action tracking'],
    engagementProcess: ['Define contractor-risk priorities', 'Assess current oversight controls', 'Verify evidence against expectations', 'Issue prioritized assurance recommendations'],
    evidenceReviewed: ['Contractor management plans', 'Field and quality records', 'Performance reporting artifacts', 'Issue and closeout histories'],
    deliverables: ['Contractor assurance report', 'Gap register', 'Corrective-action roadmap', 'Validation report', 'Closeout report'],
    expectedResult: 'Better contractor-risk governance and stronger confidence in outsourced execution control.',
    relatedServices: [
      { href: '/services/qa-qc', label: 'QA/QC' },
      { href: '/services/operational-readiness', label: 'Operational Readiness' }
    ],
    trainingLink: { href: '/training', label: 'Contractor oversight training support' },
    cta: { href: '/request-proposal', label: 'Request a Proposal' }
  },
  {
    slug: 'safety-risk-management',
    title: 'Safety and Risk Management',
    summary: 'Safety and risk-management support tied to practical control performance and operational decision quality.',
    customerProblem: 'Risk controls are often documented but not consistently translated into field behavior and decisions.',
    audience: ['Safety leaders', 'Operations managers', 'Program owners', 'Infrastructure operators'],
    scopeOfWork: ['Risk and safety-control review', 'Control-priority alignment', 'Operational risk monitoring support', 'Improvement planning'],
    engagementProcess: ['Profile operating risk context', 'Assess control design and execution', 'Prioritize risk-reduction actions', 'Validate implementation and sustainment'],
    evidenceReviewed: ['Risk registers', 'Safety-management documentation', 'Incident and near-miss trends', 'Corrective-action effectiveness records'],
    deliverables: ['Assurance review', 'Gap register', 'Readiness score', 'Corrective-action roadmap', 'Executive dashboard'],
    expectedResult: 'Improved risk visibility and stronger safety-control follow-through in operations.',
    relatedServices: [
      { href: '/services/incident-investigation', label: 'Incident Investigation' },
      { href: '/services/emergency-preparedness', label: 'Emergency Preparedness' }
    ],
    trainingLink: { href: '/training', label: 'Safety and risk training support' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'incident-investigation',
    title: 'Incident Investigation',
    summary: 'Structured investigation support focused on learning, corrective action, and recurrence prevention.',
    customerProblem: 'Organizations need credible incident learning without blame-driven noise or incomplete root-cause analysis.',
    audience: ['Safety and operations leadership', 'Program managers', 'Contractor oversight teams', 'Public-infrastructure owners'],
    scopeOfWork: ['Investigation planning and evidence capture', 'Contributing-factor analysis', 'Corrective-action design support', 'Closeout validation support'],
    engagementProcess: ['Stabilize incident learning scope', 'Collect and analyze evidence', 'Define corrective actions with ownership', 'Validate closeout effectiveness'],
    evidenceReviewed: ['Incident records', 'Witness and process documentation', 'Training and competency records', 'Corrective-action closure evidence'],
    deliverables: ['Incident learning report', 'Gap register', 'Corrective-action roadmap', 'Validation report', 'Closeout report'],
    expectedResult: 'Clearer incident learning and more reliable corrective-action execution over time.',
    relatedServices: [
      { href: '/services/safety-risk-management', label: 'Safety and Risk Management' },
      { href: '/services/embedded-hse-support', label: 'Embedded HSE Support' }
    ],
    trainingLink: { href: '/training', label: 'Incident-learning training support' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'embedded-hse-support',
    title: 'Embedded HSE Support',
    summary: 'Embedded health, safety, and environment support for execution-heavy operations and projects.',
    customerProblem: 'Programs need practical HSE support integrated with field realities and delivery pressure.',
    audience: ['Project delivery teams', 'Owner oversight teams', 'Marine and infrastructure contractors', 'Operations leaders'],
    scopeOfWork: ['Embedded HSE advisory support', 'Control-observation and coaching', 'Risk and permit process reinforcement', 'Issue and action tracking support'],
    engagementProcess: ['Define embedded support scope', 'Integrate with operational teams', 'Monitor and reinforce controls', 'Escalate and track priority issues'],
    evidenceReviewed: ['Field observations', 'Permit and control records', 'Risk and issue logs', 'Action closeout evidence'],
    deliverables: ['Readiness assessment', 'Contractor assurance report', 'Corrective-action roadmap', 'Executive dashboard', 'Closeout report'],
    expectedResult: 'Stronger day-to-day control reliability and better visibility into field execution risk.',
    relatedServices: [
      { href: '/services/safety-risk-management', label: 'Safety and Risk Management' },
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' }
    ],
    trainingLink: { href: '/training', label: 'Field-control reinforcement training support' },
    cta: { href: '/request-proposal', label: 'Request a Proposal' }
  },
  {
    slug: 'emergency-preparedness',
    title: 'Emergency Preparedness',
    summary: 'Preparedness support for emergency planning, drills, and response-readiness validation.',
    customerProblem: 'Emergency plans often exist on paper but are not consistently validated under operational conditions.',
    audience: ['Port and terminal operators', 'Shipyards', 'Infrastructure owners', 'Program and operations leadership'],
    scopeOfWork: ['Preparedness-plan review', 'Drill and exercise support', 'Response-readiness verification', 'After-action improvement planning'],
    engagementProcess: ['Assess emergency preparedness baseline', 'Design and run validation activities', 'Capture and prioritize findings', 'Support corrective-action implementation'],
    evidenceReviewed: ['Preparedness plans', 'Drill and exercise records', 'Response procedures and communications artifacts', 'After-action and closeout documentation'],
    deliverables: ['Drill report', 'Readiness assessment', 'Gap register', 'Corrective-action roadmap', 'Validation report'],
    expectedResult: 'Improved readiness to respond and clearer leadership confidence in emergency-control performance.',
    relatedServices: [
      { href: '/services/incident-investigation', label: 'Incident Investigation' },
      { href: '/services/operational-readiness', label: 'Operational Readiness' }
    ],
    trainingLink: { href: '/maritime-training', label: 'Emergency preparedness training support' },
    cta: { href: '/contact', label: 'Request a Consultation' }
  },
  {
    slug: 'program-assurance',
    title: 'Program Assurance',
    summary: 'Program-level assurance support for governance visibility, delivery discipline, and evidence-backed decisions.',
    customerProblem: 'Complex programs need consistent assurance across multiple workstreams, vendors, and stakeholders.',
    audience: ['Program directors', 'Public-infrastructure owners', 'Prime contractors', 'Executive governance teams'],
    scopeOfWork: ['Program-assurance framework review', 'Cross-workstream risk and control analysis', 'Performance-evidence governance support', 'Assurance reporting cadence design'],
    engagementProcess: ['Define assurance governance priorities', 'Assess program control maturity', 'Prioritize systemic improvement actions', 'Validate progress and closeout'],
    evidenceReviewed: ['Program governance artifacts', 'Workstream performance records', 'Risk and issue registers', 'Control and quality reporting'],
    deliverables: ['Program assurance review', 'Assurance case', 'Executive dashboard', 'Corrective-action roadmap', 'Closeout report'],
    expectedResult: 'Improved program-level visibility and stronger confidence in execution governance.',
    relatedServices: [
      { href: '/services/independent-assurance', label: 'Independent Assurance' },
      { href: '/services/qa-qc', label: 'QA/QC' }
    ],
    trainingLink: { href: '/training', label: 'Program-governance training support' },
    cta: { href: '/request-proposal', label: 'Request a Proposal' }
  }
];

export const serviceBySlug = Object.fromEntries(serviceDetails.map((item) => [item.slug, item])) as Record<ServiceDetail['slug'], ServiceDetail>;
