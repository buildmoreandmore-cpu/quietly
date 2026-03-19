"use client";

import ReactMarkdown from "react-markdown";
import { ChatMessage, Job, CompData } from "@/lib/types";
import JobTable from "./messages/JobTable";
import CompBlock from "./messages/CompBlock";
import CoverLetter from "./messages/CoverLetter";

interface Props {
  message: ChatMessage;
}

function parseSpecialBlocks(content: string) {
  const parts: { type: "text" | "jobs" | "comp" | "coverletter"; content: string }[] = [];
  const regex = /```(jobs|comp|coverletter)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: match[1] as "jobs" | "comp" | "coverletter", content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
}

export default function Message({ message }: Props) {
  const isUser = message.role === "user";
  const parts = parseSpecialBlocks(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-accent/15 text-foreground"
            : "bg-surface text-foreground"
        }`}
      >
        {parts.map((part, i) => {
          if (part.type === "jobs") {
            try {
              const jobs: Job[] = JSON.parse(part.content);
              return <JobTable key={i} jobs={jobs} />;
            } catch {
              return <pre key={i} className="text-xs overflow-auto">{part.content}</pre>;
            }
          }
          if (part.type === "comp") {
            try {
              const comp: CompData = JSON.parse(part.content);
              return <CompBlock key={i} data={comp} />;
            } catch {
              return <pre key={i} className="text-xs overflow-auto">{part.content}</pre>;
            }
          }
          if (part.type === "coverletter") {
            return <CoverLetter key={i} content={part.content} />;
          }
          return (
            <div key={i} className="chat-markdown text-sm leading-relaxed">
              <ReactMarkdown>{part.content}</ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
}
