import { NextRequest } from "next/server";
import { parseResume } from "@/lib/resume";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { extractTextFromPDF } = await import("@/lib/resume");
    const rawText = await extractTextFromPDF(buffer);
    const resume = await parseResume(buffer);

    return Response.json({ resume, resumeText: rawText });
  } catch (error) {
    console.error("Resume parse error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse resume";
    return Response.json({ error: message }, { status: 500 });
  }
}
