// JSearch API — real job listings from Google for Jobs
// https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_employment_type: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_apply_link: string;
  job_description: string;
  job_posted_at_datetime_utc: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
}

export interface JSearchResult {
  status: string;
  data: JSearchJob[];
}

export async function searchJobs(
  query: string,
  location: string,
  page: number = 1
): Promise<JSearchJob[]> {
  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) {
    console.error("JSEARCH_API_KEY not set");
    return [];
  }

  const params = new URLSearchParams({
    query: `${query} in ${location}`,
    page: String(page),
    num_pages: "1",
    date_posted: "week",
  });

  const res = await fetch(
    `https://jsearch.p.rapidapi.com/search?${params.toString()}`,
    {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    }
  );

  if (!res.ok) {
    console.error("JSearch API error:", res.status, await res.text());
    return [];
  }

  const json: JSearchResult = await res.json();
  return json.data || [];
}

export function formatSalaryRange(job: JSearchJob): string {
  if (!job.job_min_salary && !job.job_max_salary) return "";
  const min = job.job_min_salary
    ? `$${Math.round(job.job_min_salary).toLocaleString()}`
    : "";
  const max = job.job_max_salary
    ? `$${Math.round(job.job_max_salary).toLocaleString()}`
    : "";
  const period = job.job_salary_period === "YEAR" ? "/yr" : "";
  if (min && max) return `${min}–${max}${period}`;
  return `${min || max}${period}`;
}

export function formatLocation(job: JSearchJob): string {
  const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  return parts.join(", ");
}
