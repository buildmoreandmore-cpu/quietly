import OpenAI from "openai";
import { ParsedResume, ReviewFeedback } from "./types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const REVIEW_SYSTEM = `You are a resume quality reviewer. Your job is to compare an original resume against an AI-rewritten version and flag any inflation, fabrication, or dishonesty.

FLAG these problems:
- Metrics or numbers that were NOT in the original (fabricated scope)
- Buzzwords: spearheaded, leveraged, drove, passionate, seasoned, dynamic, results-driven, cutting-edge, best-in-class, instrumental, pivotal, revolutionized, transformed, orchestrated
- Superlatives or exaggerations that inflate the candidate's actual role
- Vague impressive-sounding phrases that add no substance
- Seniority inflation (making a junior sound senior)

DO NOT flag:
- Improved clarity or grammar
- Active voice rewrites that preserve meaning
- Better organization of the same information
- Removal of filler words

For each flag, provide a corrected version that keeps the clarity improvement but removes the inflation.

Return ONLY valid JSON matching this schema:
{
  "overallVerdict": "approved" | "needs_revision",
  "flags": [
    {
      "section": "experience[0].bullets[2]" or "summary" etc.,
      "original": "the original text",
      "issue": "what's wrong with the rewrite",
      "suggestion": "corrected version"
    }
  ],
  "finalResume": { ...the full corrected resume object }
}

If there are no flags, return verdict "approved" with empty flags array and the rewritten resume as finalResume.`;

export async function reviewResumeWithGPT(
  original: ParsedResume,
  rewritten: ParsedResume
): Promise<ReviewFeedback> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    max_tokens: 8192,
    messages: [
      { role: "system", content: REVIEW_SYSTEM },
      {
        role: "user",
        content: `ORIGINAL RESUME:\n${JSON.stringify(original, null, 2)}\n\nREWRITTEN RESUME:\n${JSON.stringify(rewritten, null, 2)}\n\nReview the rewrite against the original. Flag any inflation, fabrication, or dishonesty. Return the corrected final resume.`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content || "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}
