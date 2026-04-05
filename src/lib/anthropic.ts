import Anthropic from "@anthropic-ai/sdk";
import { ParsedResume } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// --- Resume Parsing ---

export async function parseResumeWithClaude(
  text: string
): Promise<ParsedResume> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Extract structured data from this resume text. Return ONLY valid JSON matching this schema:
{
  "name": string,
  "email": string,
  "phone": string,
  "summary": string,
  "skills": string[],
  "experience": [{"title": string, "company": string, "location": string, "dates": string, "bullets": string[]}],
  "education": [{"degree": string, "school": string, "year": string}],
  "certifications": string[],
  "licenses": string[]
}

Resume text:
${text}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }
  throw new Error("Failed to parse resume");
}

// --- Job Discovery ---

const DISCOVERY_SYSTEM = `You are a job discovery agent for a recruiting agency. You analyze candidate profiles and find matching job opportunities.

You are objective, concise, and direct. Never fabricate job postings. Be honest about match scores.

For each job you find, provide:
- title, company, location, job_type, salary_range (or null)
- url (real application URL if known, or constructed search URL)
- posted_date (or null), match_score (0-100), match_grade (A/B/C/D/F)
- why_it_fits (2 sentences max), one_concern (1 sentence)

Only return jobs scoring 75+. Sort by match_score descending.`;

export interface DiscoveredJob {
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_range: string | null;
  url: string;
  posted_date: string | null;
  match_score: number;
  match_grade: string;
  why_it_fits: string;
  one_concern: string;
}

export async function discoverJobs(
  resumeSummary: string,
  targetTitles: string[],
  targetLocations: string[],
  salaryFloor: number,
  blockedEmployers: string[]
): Promise<DiscoveredJob[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 8192,
    system: DISCOVERY_SYSTEM,
    messages: [
      {
        role: "user",
        content: `CANDIDATE PROFILE:
${resumeSummary}

TARGET TITLES: ${targetTitles.join(", ") || "Any relevant role"}
PREFERRED LOCATIONS: ${targetLocations.join(", ") || "Remote / Anywhere"}
MINIMUM SALARY: $${salaryFloor.toLocaleString() || "No minimum"}
BLOCKED EMPLOYERS: ${blockedEmployers.join(", ") || "None"}

Find 5-10 real job opportunities that match this candidate at 75%+ fit.

Return ONLY a JSON array of jobs:
[
  {
    "title": "...",
    "company": "...",
    "location": "...",
    "job_type": "...",
    "salary_range": "... or null",
    "url": "...",
    "posted_date": "... or null",
    "match_score": 0-100,
    "match_grade": "A/B/C/D/F",
    "why_it_fits": "...",
    "one_concern": "..."
  }
]

No markdown, no explanation. Only valid JSON array.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

// --- Outreach Message Generation ---

const OUTREACH_SYSTEM = `You are a recruiting agent representing a curated pool of passive candidates. Write a personalized outbound message to a hiring manager on behalf of a candidate who matches their open role.

You are not a spam bot. You represent one specific candidate for one specific role. Every message must feel like it was written by a sharp human recruiter who did their homework.

RULES:
- Never reveal the candidate's name or contact info upfront
- Never say "I am an AI" — write as a recruiting agent
- Never use buzzwords: "rockstar", "ninja", "passionate", "guru"
- Never use hollow openers: "Hope this finds you well"
- Always reference something specific from the job listing
- Always lead with value — what the candidate brings, not what they want
- Keep it concise and human`;

export interface OutreachMessage {
  subject: string;
  message: string;
  variant: string;
}

export async function generateOutreach(
  candidateSummary: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
  matchScore: number,
  channel: string
): Promise<OutreachMessage> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2048,
    system: OUTREACH_SYSTEM,
    messages: [
      {
        role: "user",
        content: `CANDIDATE (anonymous):
${candidateSummary}

JOB: ${jobTitle} at ${company}
${jobDescription}

MATCH SCORE: ${matchScore}/100
CHANNEL: ${channel}

Write a medium-length outreach message (max 7 sentences) for ${channel}.
Include a subject line if email.

Return ONLY valid JSON:
{
  "subject": "subject line (or null if linkedin)",
  "message": "the outreach message",
  "variant": "medium"
}

No markdown, no explanation.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}
