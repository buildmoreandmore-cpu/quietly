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
            <svg className="w-4 h-4 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
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
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-accent/50 placeholder:text-muted disabled:opacity-50 min-h-[40px] max-h-[120px] text-foreground"
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
          className="shrink-0 w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
