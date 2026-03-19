import { NextRequest } from "next/server";
import { buildSystemPrompt, streamChat } from "@/lib/anthropic";
import { searchJobs, parseJobQuery } from "@/lib/jobs";
import { ParsedResume } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      resume,
      blockedEmployers = [],
      salaryFloor = 0,
    } = body as {
      message: string;
      history: { role: "user" | "assistant"; content: string }[];
      resume: ParsedResume | null;
      blockedEmployers: string[];
      salaryFloor: number;
    };

    let systemPrompt = buildSystemPrompt(resume, blockedEmployers, salaryFloor);

    // Check for job search intent
    const jobQuery = parseJobQuery(message);
    if (jobQuery) {
      const jobs = await searchJobs(
        jobQuery.role,
        jobQuery.location,
        resume,
        blockedEmployers
      );
      systemPrompt += `\n\nJob search results for "${jobQuery.role}" in "${jobQuery.location}":\n\`\`\`jobs\n${JSON.stringify(jobs)}\n\`\`\`\n\nPresent these results naturally. Include the \`\`\`jobs code block with the JSON array so the UI can render it as a table. Highlight why each role fits the user's background. Mention the match score.`;
    }

    const messages = [
      ...history,
      { role: "user" as const, content: message },
    ];

    const stream = await streamChat(messages, systemPrompt);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
