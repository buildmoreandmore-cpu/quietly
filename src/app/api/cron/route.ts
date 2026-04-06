import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { generateOutreach } from "@/lib/anthropic";
import { searchJobs } from "@/lib/jsearch";
import { scoreJobs } from "@/lib/scoring";
// import { sendEmail, outreachEmail } from "@/lib/email";
import { formatSalaryRange, formatLocation } from "@/lib/jsearch";
import type { ParsedResume } from "@/lib/types";

export const maxDuration = 300;

// GET /api/cron — nightly discovery + outreach
// Vercel Cron calls GET by default
export async function GET(request: NextRequest) {
  // Vercel Cron sets this header automatically
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();

  // Pull all active, onboarded, subscribed candidates with resumes
  const { data: candidates, error: fetchErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .eq("onboarded", true)
    .not("resume", "is", null)
    .in("subscription_status", ["active", "trialing"]);

  if (fetchErr) {
    console.error("Failed to fetch candidates:", fetchErr);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }

  if (!candidates?.length) {
    return NextResponse.json({ message: "No active candidates", processed: 0 });
  }

  let totalMatches = 0;
  let totalOutreach = 0;

  for (const candidate of candidates) {
    try {
      const resume = candidate.resume as ParsedResume;
      const resumeSummary = candidate.resume_text || buildResumeSummary(resume);
      const titles = (candidate.target_titles as string[]) || [];
      const locations = (candidate.target_locations as string[]) || [];

      // Search real jobs via JSearch
      const queries = titles.length
        ? titles
        : [resume.experience?.[0]?.title || resume.summary?.split(" ").slice(0, 4).join(" ") || ""];

      const allJobs = [];
      for (const title of queries.slice(0, 3)) {
        for (const location of (locations.length ? locations : ["Remote"]).slice(0, 2)) {
          const jobs = await searchJobs(title, location);
          allJobs.push(...jobs);
        }
      }

      // Deduplicate by job_id
      const uniqueJobs = Array.from(
        new Map(allJobs.map((j) => [j.job_id, j])).values()
      );

      if (!uniqueJobs.length) continue;

      // Score with Claude Haiku
      const scored = await scoreJobs(
        resumeSummary,
        uniqueJobs,
        candidate.salary_floor || 0
      );

      // Insert matches
      for (const { job, matchScore, matchGrade, whyItFits, oneConcern } of scored) {
        const { data: match, error: insertErr } = await supabase
          .from("matches")
          .insert({
            user_id: candidate.id,
            title: job.job_title,
            company: job.employer_name,
            location: formatLocation(job),
            job_type: job.job_employment_type || "FULLTIME",
            salary_range: formatSalaryRange(job),
            url: job.job_apply_link,
            posted_date: job.job_posted_at_datetime_utc,
            match_score: matchScore,
            match_grade: matchGrade,
            why_it_fits: whyItFits,
            one_concern: oneConcern,
            source: "jsearch",
            status: "new",
          })
          .select()
          .single();

        if (insertErr || !match) {
          console.error("Failed to insert match:", insertErr);
          continue;
        }

        totalMatches++;

        // Generate + send outreach for 75+ matches
        if (matchScore >= 75) {
          try {
            const outreach = await generateOutreach(
              resumeSummary,
              job.job_title,
              job.employer_name,
              job.job_description?.slice(0, 1000) || whyItFits,
              matchScore,
              "email"
            );

            await supabase
              .from("outreach_log")
              .insert({
                match_id: match.id,
                user_id: candidate.id,
                channel: "email",
                variant: outreach.variant,
                subject: outreach.subject,
                message_body: outreach.message,
                status: "draft",
              });

            // Email sending — uncomment when email provider is configured
            // and you have a way to get hiring manager emails (enrichment/Composio)
            // if (outreachRow) {
            //   const replyTo = `reply+${outreachRow.id}@quietly.app`;
            //   const msg = outreachEmail(outreach.subject || job.job_title, outreach.message, replyTo);
            //   msg.to = hiringManagerEmail;
            //   const result = await sendEmail(msg);
            //   if (result.success) {
            //     await supabase.from("outreach_log").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", outreachRow.id);
            //     await supabase.from("matches").update({ status: "outreach_sent" }).eq("id", match.id);
            //   }
            // }

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

// Keep POST for backward compat / manual triggers
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Forward to GET handler with proper auth
  const url = new URL(request.url);
  const getRequest = new NextRequest(url, {
    method: "GET",
    headers: new Headers({
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    }),
  });
  return GET(getRequest);
}

function buildResumeSummary(resume: ParsedResume): string {
  const expSummary = resume.experience
    .slice(0, 3)
    .map((e) => `${e.title} at ${e.company} (${e.dates})`)
    .join("; ");

  return `${resume.name}. ${resume.summary}. Skills: ${resume.skills.join(", ")}. Experience: ${expSummary}. Education: ${resume.education.map((e) => `${e.degree} from ${e.school}`).join("; ")}.`;
}
