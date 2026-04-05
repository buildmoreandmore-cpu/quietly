export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: string[];
  licenses: string[];
}

export type MatchStatus =
  | "new"
  | "outreach_sent"
  | "responded"
  | "intro_made"
  | "passed"
  | "expired";

export type OutreachStatus =
  | "draft"
  | "sent"
  | "opened"
  | "responded"
  | "intro_made"
  | "no_response";

export interface Match {
  id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange: string;
  url: string;
  postedDate: string;
  matchScore: number;
  matchGrade: string;
  whyItFits: string;
  oneConcern: string;
  source: string;
  status: MatchStatus;
  discoveredAt: string;
}

export interface OutreachEntry {
  id: string;
  matchId: string;
  userId: string;
  hiringManager: string;
  channel: string;
  variant: string;
  subject: string;
  messageBody: string;
  sentAt: string | null;
  respondedAt: string | null;
  responseSummary: string | null;
  status: OutreachStatus;
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  email: string;
  fullName: string;
  resume: ParsedResume | null;
  resumeText: string | null;
  targetTitles: string[];
  targetLocations: string[];
  targetIndustries: string[];
  blockedEmployers: string[];
  salaryFloor: number;
  jobType: string;
  isActive: boolean;
  onboarded: boolean;
  lastDiscoveryAt: string | null;
}

export interface DashboardStats {
  totalMatches: number;
  newMatches: number;
  outreachSent: number;
  responses: number;
  introsMade: number;
}
