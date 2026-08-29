export type AcademyCode = "CORE" | "OSH" | "MAR" | "CON" | "CIA" | "GOV" | "QOE" | "ESR" | "TRN" | "TSP" | "PEL";
export type CourseDomain = "SAF" | "RSK" | "RCS" | "QMS" | "OHI" | "EPC" | "ESS" | "DST" | "LEP" | "MPI";
export type CourseStatus = "Planned" | "Draft" | "Human Review" | "Controlled Pilot" | "Active" | "Archived";
export type GateAuthority = "AI-assisted" | "Human" | "Independent" | "Registrar" | "Executive";

export interface Academy {
  code: AcademyCode;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  scope: string[];
  targetRoles: string[];
  painPoints: string[];
  pathways: string[];
  deploymentOptions: string[];
  caseScenarios: string[];
  facultyProfile: string[];
}

export interface Course {
  id: string;
  title: string;
  academy: AcademyCode;
  domain: CourseDomain;
  version: string;
  durationHours: number;
  jurisdiction: string[];
  status: CourseStatus;
  summary: string;
  outcomes: string[];
  scoreThreshold: number;
  credentialEligible: boolean;
  claimBoundary: string;
}

export interface Cohort {
  id: string;
  name: string;
  academy: AcademyCode;
  deliveryMode: "Private tenant" | "Blended" | "Instructor-led" | "Self-paced";
  seats: number;
  reportingCadence: "Weekly" | "Biweekly" | "Monthly";
  status: "Proposed" | "Scheduled" | "Active" | "Completed";
}

export interface ProductionGate {
  id: `G${number}`;
  title: string;
  purpose: string;
  authority: GateAuthority;
  aiAllowed: boolean;
  humanRequired: boolean;
  independentVerification: boolean;
  releaseEffect: string;
}

export interface CertificateRecord {
  uuid: string;
  courseId: string;
  courseVersion: string;
  completedAt: string;
  score: number;
  threshold: number;
  issuingAuthority: string;
  status: "Valid" | "Revoked" | "Expired";
  evidenceHash: string;
}
