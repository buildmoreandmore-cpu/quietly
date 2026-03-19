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

export type AppStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  source: string;
  posted: string;
  description: string;
  score: number;
}

export interface Application {
  id: string;
  job: Job;
  status: AppStatus;
  notes: string;
  appliedAt: string;
  updatedAt: string;
}

export interface Chip {
  label: string;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  jobs?: Job[];
  comp?: CompData;
}

export interface CompData {
  role: string;
  company: string;
  location: string;
  baseLow: number;
  baseHigh: number;
  totalLow: number;
  totalHigh: number;
  recommendation: string;
}

export interface Session {
  id: string;
  resume: ParsedResume | null;
  blockedEmployers: string[];
  salaryFloor: number;
  preferences: Record<string, string>;
  createdAt: string;
}
