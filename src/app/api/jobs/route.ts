import { NextRequest } from "next/server";
import { searchJobs } from "@/lib/jobs";
import { ParsedResume } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { role, location, resume, blockedEmployers = [] } = (await req.json()) as {
      role: string;
      location: string;
      resume: ParsedResume | null;
      blockedEmployers: string[];
    };

    const jobs = await searchJobs(role, location, resume, blockedEmployers);
    return Response.json({ jobs });
  } catch (error) {
    console.error("Jobs API error:", error);
    return Response.json({ error: "Job search failed" }, { status: 500 });
  }
}
