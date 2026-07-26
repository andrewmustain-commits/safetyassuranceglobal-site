export type IndustryDetail = {
  slug:
    | 'shipyards'
    | 'ports-marine-terminals'
    | 'vessel-operators'
    | 'marine-contractors'
    | 'government'
    | 'critical-infrastructure';
  title: string;
  operatingContext: string;
  commonRisks: string[];
  assuranceGaps: string[];
  relevantServices: { href: string; label: string }[];
  evidenceReviewed: string[];
  deliverables: string[];
  decisionSupport: string;
  cta: { href: string; label: string };
};

export const industryDetails: IndustryDetail[] = [
  {
    slug: 'shipyards',
    title: 'Shipyards',
    operatingContext: 'High-tempo project and maintenance environments with complex contractor interfaces and quality-critical handovers.',
    commonRisks: ['Inconsistent field quality controls', 'Contractor coordination failures', 'Readiness drift near delivery milestones'],
    assuranceGaps: ['Incomplete closeout evidence', 'Uneven corrective-action follow-through', 'Weak linkage between safety and quality controls'],
    relevantServices: [
      { href: '/services/qa-qc', label: 'QA/QC' },
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' },
      { href: '/services/operational-readiness', label: 'Operational Readiness' }
    ],
    evidenceReviewed: ['Inspection and test records', 'Work-pack closeout artifacts', 'Contractor performance records', 'Corrective-action histories'],
    deliverables: ['QA/QC review', 'Contractor assurance report', 'Gap register', 'Readiness score', 'Closeout report'],
    decisionSupport: 'Supports go/no-go readiness and targeted quality-control interventions.',
    cta: { href: '/contact', label: 'Discuss Shipyard Assurance' }
  },
  {
    slug: 'ports-marine-terminals',
    title: 'Ports and Marine Terminals',
    operatingContext: 'Operationally sensitive environments with throughput pressure, contractor reliance, and emergency-readiness demands.',
    commonRisks: ['Operational interruption risk', 'Emergency-preparedness gaps', 'Inconsistent contractor-control execution'],
    assuranceGaps: ['Fragmented evidence of control effectiveness', 'Weak drill-to-corrective-action linkage', 'Limited leadership visibility into readiness trends'],
    relevantServices: [
      { href: '/services/operational-readiness', label: 'Operational Readiness' },
      { href: '/services/emergency-preparedness', label: 'Emergency Preparedness' },
      { href: '/services/safety-risk-management', label: 'Safety and Risk Management' }
    ],
    evidenceReviewed: ['Emergency plans and exercise records', 'Operational control documentation', 'Contractor oversight artifacts', 'Incident and near-miss trends'],
    deliverables: ['Readiness assessment', 'Drill report', 'Validation report', 'Corrective-action roadmap', 'Executive dashboard'],
    decisionSupport: 'Improves assurance confidence for continuity, safety, and emergency response readiness.',
    cta: { href: '/contact', label: 'Discuss Port and Terminal Readiness' }
  },
  {
    slug: 'vessel-operators',
    title: 'Vessel Owners and Operators',
    operatingContext: 'Distributed operations requiring disciplined control execution, crew readiness, and incident-learning reliability.',
    commonRisks: ['Readiness variability across operations', 'Uneven control implementation', 'Delayed corrective-action closure'],
    assuranceGaps: ['Incomplete evidence traceability', 'Weak integration of lessons learned', 'Limited decision visibility for leadership'],
    relevantServices: [
      { href: '/services/operational-readiness', label: 'Operational Readiness' },
      { href: '/services/incident-investigation', label: 'Incident Investigation' },
      { href: '/services/safety-risk-management', label: 'Safety and Risk Management' }
    ],
    evidenceReviewed: ['Operating procedures', 'Training and competency records', 'Incident and closeout records', 'Risk and control logs'],
    deliverables: ['Readiness assessment', 'Incident learning report', 'Gap register', 'Corrective-action roadmap', 'Validation report'],
    decisionSupport: 'Provides clearer insight into operational-control reliability and risk-priority actions.',
    cta: { href: '/contact', label: 'Discuss Vessel-Operator Support' }
  },
  {
    slug: 'marine-contractors',
    title: 'Marine Contractors',
    operatingContext: 'Execution-driven delivery where owners and primes require reliable evidence of control performance.',
    commonRisks: ['Scope/control misalignment', 'Performance variability', 'Quality and safety evidence gaps'],
    assuranceGaps: ['Insufficient verification records', 'Inconsistent corrective-action discipline', 'Weak oversight transparency'],
    relevantServices: [
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' },
      { href: '/services/qa-qc', label: 'QA/QC' },
      { href: '/services/embedded-hse-support', label: 'Embedded HSE Support' }
    ],
    evidenceReviewed: ['Performance and field records', 'QA/QC artifacts', 'Risk and issue logs', 'Corrective-action evidence'],
    deliverables: ['Contractor assurance report', 'QA/QC review', 'Gap register', 'Executive dashboard', 'Closeout report'],
    decisionSupport: 'Strengthens owner and prime confidence in contractor control performance.',
    cta: { href: '/request-proposal', label: 'Request Marine Contractor Support' }
  },
  {
    slug: 'government',
    title: 'Government and Defense Infrastructure',
    operatingContext: 'Public-sector and defense-adjacent infrastructure programs requiring conservative, evidence-first support language.',
    commonRisks: ['Overstated capability claims', 'Program-control visibility gaps', 'Contractor oversight complexity'],
    assuranceGaps: ['Inconsistent assurance documentation', 'Weak linkage between findings and remediation', 'Limited independent review posture'],
    relevantServices: [
      { href: '/services/program-assurance', label: 'Program Assurance' },
      { href: '/services/independent-assurance', label: 'Independent Assurance' },
      { href: '/services/contractor-assurance', label: 'Contractor Assurance' }
    ],
    evidenceReviewed: ['Program governance artifacts', 'Assurance and validation records', 'Risk and issue controls', 'Contractor oversight evidence'],
    deliverables: ['Program assurance review', 'Assurance case inputs', 'Evidence package', 'Corrective-action roadmap', 'Validation report'],
    decisionSupport: 'Supports disciplined oversight decisions without implying endorsement or award status.',
    cta: { href: '/government', label: 'Discuss Government-Focused Support' }
  },
  {
    slug: 'critical-infrastructure',
    title: 'Critical Infrastructure',
    operatingContext: 'High-consequence operations across capital, utility, and facility-intensive environments.',
    commonRisks: ['Operational disruption risk', 'Inconsistent control execution', 'Assurance blind spots across contractors and sites'],
    assuranceGaps: ['Fragmented evidence quality', 'Limited readiness monitoring cadence', 'Delayed remediation closeout'],
    relevantServices: [
      { href: '/services/independent-assurance', label: 'Independent Assurance' },
      { href: '/services/operational-readiness', label: 'Operational Readiness' },
      { href: '/services/program-assurance', label: 'Program Assurance' }
    ],
    evidenceReviewed: ['Risk and control records', 'Operational procedures', 'Quality and contractor records', 'Validation and closeout evidence'],
    deliverables: ['Assurance review', 'Readiness assessment', 'Gap register', 'Executive dashboard', 'Closeout report'],
    decisionSupport: 'Provides leadership with evidence-backed readiness and risk-priority visibility.',
    cta: { href: '/contact', label: 'Discuss Critical-Infrastructure Assurance' }
  }
];

export const industryBySlug = Object.fromEntries(industryDetails.map((item) => [item.slug, item])) as Record<IndustryDetail['slug'], IndustryDetail>;
