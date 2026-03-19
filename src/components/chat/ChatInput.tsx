"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { useChat } from "@/hooks/useChat";
import { useResume } from "@/hooks/useResume";
import { useQuietlyStore } from "@/store/quietly";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const { sendMessage, isStreaming } = useChat();
  const { uploadResume, isUploading } = useResume();
  const { addMessage } = useQuietlyStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (input.trim() && !isStreaming) {
      sendMessage(input);
      setInput("");
    }
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resume = await uploadResume(file);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Resume uploaded successfully! I see you're **${resume.name}** with experience in ${resume.skills.slice(0, 5).join(", ")}. Your most recent role was **${resume.experience[0]?.title}** at **${resume.experience[0]?.company}**.\n\nHow can I help with your job search?`,
        timestamp: new Date().toISOString(),
      });
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't parse that resume. Please make sure it's a PDF file and try again.",
        timestamp: new Date().toISOString(),
      });
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="border-t border-border p-3 shrink-0">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 w-10 h-10 rounded-xl bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-colors disabled:opacity-50"
          title="Upload resume (PDF)"
        >
          {isUploading ? (
            <span className="animate-spin text-sm">...</span>
          ) : (
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? "Thinking..." : "Ask me anything about your job search..."}
          disabled={isStreaming}
          rows={1}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-accent/50 placeholder:text-muted disabled:opacity-50 min-h-[40px] max-h-[120px]"
          style={{ height: "40px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "40px";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-accent text-background flex items-center justify-center hover:bg-accent-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
