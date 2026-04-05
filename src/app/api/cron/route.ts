import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { discoverJobs, generateOutreach } from "@/lib/anthropic";
import type { ParsedResume } from "@/lib/types";

// POST /api/cron — nightly discovery + outreach generation
// Protected by CRON_SECRET header
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();

  // Pull all active, onboarded candidates with resumes
  const { data: candidates, error: fetchErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .eq("onboarded", true)
    .not("resume", "is", null);

  if (fetchErr) {
    console.error("Failed to fetch candidates:", fetchErr);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }

  if (!candidates?.length) {
    return NextResponse.json({ message: "No active candidates", processed: 0 });
  }

  let totalMatches = 0;
  let totalOutreach = 0;

  for (const candidate of candidates) {
    try {
      const resume = candidate.resume as ParsedResume;

      // Build resume summary for the prompt
      const resumeSummary = candidate.resume_text || buildResumeSummary(resume);

      // Run discovery
      const jobs = await discoverJobs(
        resumeSummary,
        candidate.target_titles || [],
        candidate.target_locations || [],
        candidate.salary_floor || 0,
        candidate.blocked_employers || []
      );

      // Insert matches
      for (const job of jobs) {
        const { data: match, error: insertErr } = await supabase
          .from("matches")
          .insert({
            user_id: candidate.id,
            title: job.title,
            company: job.company,
            location: job.location,
            job_type: job.job_type,
            salary_range: job.salary_range,
            url: job.url,
            posted_date: job.posted_date,
            match_score: job.match_score,
            match_grade: job.match_grade,
            why_it_fits: job.why_it_fits,
            one_concern: job.one_concern,
            source: "discovery",
            status: "new",
          })
          .select()
          .single();

        if (insertErr || !match) {
          console.error("Failed to insert match:", insertErr);
          continue;
        }

        totalMatches++;

        // Generate outreach for 75+ matches
        if (job.match_score >= 75) {
          try {
            const outreach = await generateOutreach(
              resumeSummary,
              job.title,
              job.company,
              job.why_it_fits,
              job.match_score,
              "email"
            );

            await supabase.from("outreach_log").insert({
              match_id: match.id,
              user_id: candidate.id,
              channel: "email",
              variant: outreach.variant,
              subject: outreach.subject,
              message_body: outreach.message,
              status: "draft",
            });

            totalOutreach++;
          } catch (outreachErr) {
            console.error("Outreach generation failed:", outreachErr);
          }
        }
      }

      // Update last_discovery_at
      await supabase
        .from("profiles")
        .update({ last_discovery_at: new Date().toISOString() })
        .eq("id", candidate.id);

    } catch (err) {
      console.error(`Discovery failed for candidate ${candidate.id}:`, err);
    }
  }

  return NextResponse.json({
    message: "Discovery complete",
    candidates: candidates.length,
    matches: totalMatches,
    outreach: totalOutreach,
  });
}

function buildResumeSummary(resume: ParsedResume): string {
  const expSummary = resume.experience
    .slice(0, 3)
    .map((e) => `${e.title} at ${e.company} (${e.dates})`)
    .join("; ");

  return `${resume.name}. ${resume.summary}. Skills: ${resume.skills.join(", ")}. Experience: ${expSummary}. Education: ${resume.education.map((e) => `${e.degree} from ${e.school}`).join("; ")}.`;
}
