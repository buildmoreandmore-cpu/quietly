import { NextResponse } from "next/server";
import { rewriteResumeWithClaude } from "@/lib/anthropic";
import { reviewResumeWithGPT } from "@/lib/openai";
import { ParsedResume } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { resume } = (await request.json()) as { resume: ParsedResume };

    if (!resume || !resume.name) {
      return NextResponse.json(
        { error: "Invalid resume data" },
        { status: 400 }
      );
    }

    // Step 1: Claude rewrites for clarity
    const rewrittenResume = await rewriteResumeWithClaude(resume);

    // Step 2: GPT reviews for inflation
    const reviewFeedback = await reviewResumeWithGPT(resume, rewrittenResume);

    return NextResponse.json({
      rewrittenResume,
      reviewFeedback,
      originalResume: resume,
    });
  } catch (err) {
    console.error("Resume refresh error:", err);
    return NextResponse.json(
      { error: "Failed to refresh resume" },
      { status: 500 }
    );
  }
}
