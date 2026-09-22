export const INSTITUTE_ARCHITECTURE_VERSION = 'B1-B13-v1.0';
export const INSTITUTE_ID = 'IOA';

export const PROGRAM_STATES = ['DRAFT','DESIGN_REVIEW','AUTHORITY_REVIEW','REGULATORY_REVIEW','CONTENT_QA','ASSESSMENT_QA','ACCESSIBILITY_REVIEW','CLAIMS_REVIEW','ASSURANCE_REVIEW','RELEASE_CANDIDATE','RELEASE_AUTHORIZED','ACTIVE','MONITORED','SUSPENDED','WITHDRAWN','RETIRED'] as const;
export const COURSE_STATES = ['DRAFT','AUTHORING','HUMAN_REVIEW','QA','ASSESSMENT_READY','RELEASE_CANDIDATE','RELEASED','REVISION_REQUIRED','WITHDRAWN'] as const;
export const LEARNER_STATES = ['PROSPECT','APPLICATION','AUTHORIZED','ENROLLED','ACTIVE','COMPLETED','ASSESSMENT_PENDING','ASSESSMENT_PASSED','COMPLETION_VERIFIED','CREDENTIAL_ELIGIBLE','WITHDRAWN','FAILED','SUSPENDED','INACTIVE'] as const;
export const CREDENTIAL_STATES = ['NOT_ELIGIBLE','ELIGIBILITY_REVIEW','ELIGIBLE','AUTHORITY_REVIEW','ISSUANCE_AUTHORIZED','ISSUED','REGISTERED','VERIFIABLE','WITHHELD','REJECTED','SUSPENDED','REVOKED','EXPIRED'] as const;

export type ProgramState = typeof PROGRAM_STATES[number];
export type CourseState = typeof COURSE_STATES[number];
export type LearnerState = typeof LEARNER_STATES[number];
export type CredentialState = typeof CREDENTIAL_STATES[number];

export type TransitionMap<S extends string> = Readonly<Record<S, readonly S[]>>;

export const PROGRAM_TRANSITIONS: TransitionMap<ProgramState> = {
  DRAFT: ['DESIGN_REVIEW'], DESIGN_REVIEW: ['AUTHORITY_REVIEW','DRAFT'], AUTHORITY_REVIEW: ['REGULATORY_REVIEW','DRAFT'],
  REGULATORY_REVIEW: ['CONTENT_QA','WITHDRAWN'], CONTENT_QA: ['ASSESSMENT_QA','DESIGN_REVIEW'],
  ASSESSMENT_QA: ['ACCESSIBILITY_REVIEW','CONTENT_QA'], ACCESSIBILITY_REVIEW: ['CLAIMS_REVIEW','CONTENT_QA'],
  CLAIMS_REVIEW: ['ASSURANCE_REVIEW','CONTENT_QA'], ASSURANCE_REVIEW: ['RELEASE_CANDIDATE','CONTENT_QA'],
  RELEASE_CANDIDATE: ['RELEASE_AUTHORIZED','ASSURANCE_REVIEW'], RELEASE_AUTHORIZED: ['ACTIVE'],
  ACTIVE: ['MONITORED','SUSPENDED','WITHDRAWN'], MONITORED: ['ACTIVE','SUSPENDED','WITHDRAWN','RETIRED'],
  SUSPENDED: ['MONITORED','WITHDRAWN'], WITHDRAWN: ['RELEASE_CANDIDATE','RETIRED'], RETIRED: []
};

export const COURSE_TRANSITIONS: TransitionMap<CourseState> = {
  DRAFT: ['AUTHORING'], AUTHORING: ['HUMAN_REVIEW','DRAFT'], HUMAN_REVIEW: ['QA','AUTHORING'],
  QA: ['ASSESSMENT_READY','AUTHORING'], ASSESSMENT_READY: ['RELEASE_CANDIDATE','QA'],
  RELEASE_CANDIDATE: ['RELEASED','QA'], RELEASED: ['REVISION_REQUIRED','WITHDRAWN'],
  REVISION_REQUIRED: ['AUTHORING','WITHDRAWN'], WITHDRAWN: ['AUTHORING']
};

export const CREDENTIAL_TRANSITIONS: TransitionMap<CredentialState> = {
  NOT_ELIGIBLE: ['ELIGIBILITY_REVIEW'], ELIGIBILITY_REVIEW: ['ELIGIBLE','NOT_ELIGIBLE','WITHHELD'],
  ELIGIBLE: ['AUTHORITY_REVIEW'], AUTHORITY_REVIEW: ['ISSUANCE_AUTHORIZED','WITHHELD','REJECTED'],
  ISSUANCE_AUTHORIZED: ['ISSUED','WITHHELD'], ISSUED: ['REGISTERED','SUSPENDED','REVOKED'],
  REGISTERED: ['VERIFIABLE','SUSPENDED','REVOKED','EXPIRED'], VERIFIABLE: ['SUSPENDED','REVOKED','EXPIRED'],
  WITHHELD: ['ELIGIBILITY_REVIEW','AUTHORITY_REVIEW','REJECTED'], REJECTED: ['ELIGIBILITY_REVIEW'],
  SUSPENDED: ['VERIFIABLE','REVOKED','EXPIRED'], REVOKED: [], EXPIRED: ['ELIGIBILITY_REVIEW']
};

export function canTransition<S extends string>(map: TransitionMap<S>, from: S, to: S) {
  if (map[from].includes(to)) return { allowed: true as const, from, to };
  return { allowed: false as const, from, to, reason: 'UNAUTHORIZED_STATE_TRANSITION' as const };
}

export interface InstitutionalEvent { eventId: string; entity: string; entityId: string; eventType: string; actorId: string; authorityId: string; timestamp: string; decisionId?: string; evidenceIds: string[]; correlationId: string; integrityHash?: string; }
export interface EvidenceReference { evidenceId: string; evidenceType: string; source: string; relatedEntityId: string; relatedEventId?: string; relatedDecisionId?: string; verificationStatus: 'VERIFIED'|'UNVERIFIED'|'WITHHELD'; integrityHash?: string; }
export interface InstitutionalDecision { decisionId: string; decisionType: string; decisionMakerId: string; authorityBasis: string; matter: string; evidenceIds: string[]; decision: string; limitations: string[]; effectiveAt?: string; }

export const PUBLIC_CAPABILITIES = ['PUBLIC_INFORMATION','PUBLIC_CATALOG','ENROLLMENT','COMMERCE','CREDENTIAL_ISSUANCE','PUBLIC_VERIFICATION'] as const;
export type PublicCapability = typeof PUBLIC_CAPABILITIES[number];
export type CapabilityState = 'AUTHORIZED'|'WITHHELD'|'SUSPENDED';
export interface CapabilityAuthorization { capability: PublicCapability; state: CapabilityState; authorityDecisionId?: string; effectiveAt?: string; }
