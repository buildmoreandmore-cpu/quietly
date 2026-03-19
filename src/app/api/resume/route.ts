import { NextRequest } from "next/server";
import { parseResume } from "@/lib/resume";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resume = await parseResume(buffer);

    return Response.json({ resume });
  } catch (error) {
    console.error("Resume parse error:", error);
    return Response.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
