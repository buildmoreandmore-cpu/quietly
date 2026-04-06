import Anthropic from "@anthropic-ai/sdk";
import { JSearchJob, formatSalaryRange, formatLocation } from "./jsearch";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface ScoredJob {
  job: JSearchJob;
  matchScore: number;
  matchGrade: string;
  whyItFits: string;
  oneConcern: string;
}

const SCORING_SYSTEM = `You are a job matching analyst. Score how well a candidate fits each job listing.

For each job, return:
- match_score: 0-100 integer
- match_grade: A (90+), B (75-89), C (60-74), D (40-59), F (<40)
- why_it_fits: 2 sentences max, specific to this candidate and job
- one_concern: 1 sentence, honest about potential misfit

Be honest. Don't inflate scores. A 60 is a reach. An 85 is a strong fit.
Only jobs scoring 65+ should make the cut.

Return ONLY a JSON array:
[{"job_id": "...", "match_score": N, "match_grade": "X", "why_it_fits": "...", "one_concern": "..."}]

No markdown, no explanation.`;

export async function scoreJobs(
  resumeSummary: string,
  jobs: JSearchJob[],
  salaryFloor: number
): Promise<ScoredJob[]> {
  if (!jobs.length) return [];

  // Pre-filter by salary if available
  const eligible = jobs.filter((job) => {
    if (!salaryFloor || !job.job_min_salary) return true;
    // Normalize to annual
    const annual =
      job.job_salary_period === "HOUR"
        ? job.job_min_salary * 2080
        : job.job_min_salary;
    return annual >= salaryFloor * 0.9; // 10% grace
  });

  if (!eligible.length) return [];

  const jobSummaries = eligible.map((j, i) => ({
    id: i,
    job_id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: formatLocation(j),
    type: j.job_employment_type,
    salary: formatSalaryRange(j),
    description: j.job_description?.slice(0, 500) || "",
  }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SCORING_SYSTEM,
    messages: [
      {
        role: "user",
        content: `CANDIDATE:\n${resumeSummary}\n\nJOBS:\n${JSON.stringify(jobSummaries, null, 1)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    const scores: {
      job_id: string;
      match_score: number;
      match_grade: string;
      why_it_fits: string;
      one_concern: string;
    }[] = JSON.parse(cleaned);

    // Map scores back to jobs, filter 65+
    const scoreMap = new Map(scores.map((s) => [String(s.job_id), s]));

    return eligible
      .map((job, i) => {
        const score = scoreMap.get(job.job_id) || scoreMap.get(String(i));
        if (!score || score.match_score < 65) return null;
        return {
          job,
          matchScore: score.match_score,
          matchGrade: score.match_grade,
          whyItFits: score.why_it_fits,
          oneConcern: score.one_concern,
        };
      })
      .filter((s): s is ScoredJob => s !== null)
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch {
    console.error("Failed to parse scoring response:", cleaned);
    return [];
  }
}
