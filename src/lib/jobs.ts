import { Job, ParsedResume } from "./types";

const MOCK_JOBS: Job[] = [
  {
    id: "mock-1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "Atlanta, GA",
    salary: "$140,000 - $180,000",
    url: "#",
    source: "Mock",
    posted: "2 days ago",
    description: "Build scalable microservices with TypeScript and Node.js. Lead a team of 4 engineers.",
    score: 0,
  },
  {
    id: "mock-2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$120,000 - $150,000",
    url: "#",
    source: "Mock",
    posted: "1 day ago",
    description: "React, Next.js, and PostgreSQL. Early-stage startup with equity.",
    score: 0,
  },
  {
    id: "mock-3",
    title: "Staff Engineer",
    company: "BigFinance Inc",
    location: "New York, NY (Hybrid)",
    salary: "$190,000 - $240,000",
    url: "#",
    source: "Mock",
    posted: "3 days ago",
    description: "Design distributed systems for real-time trading platform. Python and Go expertise preferred.",
    score: 0,
  },
  {
    id: "mock-4",
    title: "Backend Engineer",
    company: "HealthTech Co",
    location: "Atlanta, GA",
    salary: "$130,000 - $160,000",
    url: "#",
    source: "Mock",
    posted: "5 days ago",
    description: "Build HIPAA-compliant APIs with Node.js. Healthcare experience a plus.",
    score: 0,
  },
  {
    id: "mock-5",
    title: "Engineering Manager",
    company: "CloudScale",
    location: "Remote",
    salary: "$170,000 - $210,000",
    url: "#",
    source: "Mock",
    posted: "1 week ago",
    description: "Lead a platform engineering team. AWS, Kubernetes, CI/CD pipelines.",
    score: 0,
  },
];

export function parseJobQuery(message: string): { role: string; location: string } | null {
  const patterns = [
    /find\s+(?:me\s+)?(.+?)\s+(?:roles?|jobs?|positions?)\s+(?:in|near|around)\s+(.+)/i,
    /(?:search|look)\s+(?:for\s+)?(.+?)\s+(?:roles?|jobs?|positions?)\s+(?:in|near|around)\s+(.+)/i,
    /(.+?)\s+(?:roles?|jobs?|positions?)\s+(?:in|near|around)\s+(.+)/i,
    /find\s+(?:me\s+)?(.+?)\s+(?:roles?|jobs?|positions?)/i,
    /(?:search|look)\s+(?:for\s+)?(.+?)\s+(?:roles?|jobs?|positions?)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        role: match[1].trim(),
        location: match[2]?.trim() || "Remote",
      };
    }
  }

  // Check for generic job search intent
  if (/(?:find|search|look for|any)\s+(?:me\s+)?(?:jobs?|roles?|positions?|openings?|opportunities)/i.test(message)) {
    return { role: "software engineer", location: "Remote" };
  }

  return null;
}

export function scoreJob(job: Job, resume: ParsedResume | null): number {
  if (!resume) return 50;

  let score = 50;
  const desc = (job.title + " " + job.description).toLowerCase();
  const skills = resume.skills.map((s) => s.toLowerCase());

  for (const skill of skills) {
    if (desc.includes(skill)) score += 8;
  }

  for (const exp of resume.experience) {
    if (desc.includes(exp.title.toLowerCase())) score += 10;
  }

  return Math.min(score, 98);
}

export async function searchJobs(
  role: string,
  location: string,
  resume: ParsedResume | null,
  blockedEmployers: string[]
): Promise<Job[]> {
  const serperKey = process.env.SERPER_API_KEY;

  let jobs: Job[];

  if (serperKey) {
    jobs = await searchSerper(role, location, serperKey);
  } else {
    // Mock mode — filter by role keyword
    const roleWords = role.toLowerCase().split(/\s+/);
    jobs = MOCK_JOBS.filter((j) => {
      const text = (j.title + " " + j.description).toLowerCase();
      return roleWords.some((w) => text.includes(w));
    });
    if (jobs.length === 0) jobs = MOCK_JOBS;
  }

  // Filter blocked employers
  const blocked = blockedEmployers.map((e) => e.toLowerCase());
  jobs = jobs.filter((j) => !blocked.includes(j.company.toLowerCase()));

  // Score and sort
  jobs = jobs.map((j) => ({ ...j, score: scoreJob(j, resume) }));
  jobs.sort((a, b) => b.score - a.score);

  return jobs;
}

async function searchSerper(role: string, location: string, apiKey: string): Promise<Job[]> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: `${role} jobs ${location}`,
      type: "search",
      num: 10,
    }),
  });

  if (!res.ok) {
    console.error("Serper API error:", res.status);
    return MOCK_JOBS;
  }

  const data = await res.json();
  const organic = data.organic || [];

  return organic.map((item: Record<string, string>, i: number) => ({
    id: `serper-${i}`,
    title: item.title || role,
    company: extractCompany(item.title || "", item.snippet || ""),
    location: location,
    salary: extractSalary(item.snippet || ""),
    url: item.link || "#",
    source: "Google Jobs",
    posted: item.date || "Recent",
    description: item.snippet || "",
    score: 0,
  }));
}

function extractCompany(title: string, snippet: string): string {
  const atMatch = title.match(/at\s+(.+?)(?:\s*[-|]|$)/i);
  if (atMatch) return atMatch[1].trim();
  const dashMatch = title.match(/[-|]\s*(.+?)$/);
  if (dashMatch) return dashMatch[1].trim();
  return snippet.split(/[.\-,]/)[0]?.trim().slice(0, 30) || "Unknown";
}

function extractSalary(text: string): string {
  const match = text.match(/\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|yr|annum))?/i);
  return match ? match[0] : "Not listed";
}
