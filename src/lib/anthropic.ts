import Anthropic from "@anthropic-ai/sdk";
import { ParsedResume } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export function buildSystemPrompt(
  resume: ParsedResume | null,
  blockedEmployers: string[],
  salaryFloor: number
): string {
  let prompt = `You are Quietly, a private AI career assistant. You help users find jobs, negotiate compensation, write cover letters, and prepare for interviews — all without any public exposure.

Your tone is professional, direct, and encouraging. You give specific, actionable advice.

When the user asks to find jobs, you will receive job results in your context. Present them naturally in conversation, highlighting why each is a good fit. Always include the job data in a \`\`\`jobs code block so the UI can render it as a table.

When the user asks about compensation for a role/company, provide a detailed breakdown with a \`\`\`comp code block containing JSON with: role, company, location, baseLow, baseHigh, totalLow, totalHigh, recommendation.

When writing cover letters, wrap them in a \`\`\`coverletter code block.

Important rules:
- Never suggest the user post publicly on LinkedIn or any social platform
- Keep everything private and confidential
- Be specific with salary numbers, not vague ranges
- When presenting jobs, always score them against the user's background`;

  if (resume) {
    prompt += `\n\nUser's Resume:
Name: ${resume.name}
Skills: ${resume.skills.join(", ")}
Experience: ${resume.experience.map((e) => `${e.title} at ${e.company} (${e.dates})`).join("; ")}
Education: ${resume.education.map((e) => `${e.degree} from ${e.school}`).join("; ")}
Certifications: ${resume.certifications.join(", ")}`;
  }

  if (blockedEmployers.length > 0) {
    prompt += `\n\nBLOCKED EMPLOYERS (never show jobs from these): ${blockedEmployers.join(", ")}`;
  }

  if (salaryFloor > 0) {
    prompt += `\n\nMinimum salary requirement: $${salaryFloor.toLocaleString()}`;
  }

  return prompt;
}

export async function streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
) {
  return client.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });
}

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
