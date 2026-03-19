"use client";

import { useEffect, useRef } from "react";
import { useQuietlyStore } from "@/store/quietly";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

export default function MessageList() {
  const { messages, isStreaming } = useQuietlyStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4 text-accent font-bold">Quietly</div>
            <p className="text-muted text-sm mb-6">
              Your private AI career assistant. Upload your resume to get
              started, or just ask me anything about your job search.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                "Find me jobs in Atlanta",
                "What should I ask for at Google?",
                "Write a cover letter",
                "Help me prep for interviews",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const input = document.querySelector<HTMLTextAreaElement>("#chat-input");
                    if (input) {
                      input.value = suggestion;
                      input.focus();
                      input.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                  }}
                  className="p-3 rounded-lg border border-border text-left hover:bg-surface-hover hover:border-accent/30 transition-colors text-muted"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isStreaming && messages[messages.length - 1]?.content === "" && (
        <TypingIndicator />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
