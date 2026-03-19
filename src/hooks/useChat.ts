"use client";

import { useCallback } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { ChatMessage, Chip } from "@/lib/types";

export function useChat() {
  const {
    messages,
    addMessage,
    updateLastAssistantMessage,
    isStreaming,
    setIsStreaming,
    resume,
    blockedEmployers,
    salaryFloor,
    setChips,
  } = useQuietlyStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming || !content.trim()) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMsg);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            history: messages.slice(-20).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            resume,
            blockedEmployers,
            salaryFloor,
          }),
        });

        if (!res.ok) throw new Error("Chat failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          updateLastAssistantMessage(fullContent);
        }

        // Generate context-aware chips
        const newChips = generateChips(fullContent);
        setChips(newChips);
      } catch (err) {
        console.error("Chat error:", err);
        updateLastAssistantMessage(
          "Sorry, I encountered an error. Please try again."
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [
      messages,
      isStreaming,
      resume,
      blockedEmployers,
      salaryFloor,
      addMessage,
      updateLastAssistantMessage,
      setIsStreaming,
      setChips,
    ]
  );

  return { messages, sendMessage, isStreaming };
}

function generateChips(response: string): Chip[] {
  const chips: Chip[] = [];

  if (response.includes("```jobs")) {
    chips.push(
      { label: "Compare compensation", prompt: "What should I ask for in comp at these companies?" },
      { label: "Write a cover letter", prompt: "Write a cover letter for the top result" },
      { label: "Find more roles", prompt: "Find me more similar roles" },
      { label: "Interview prep", prompt: "Help me prep for interviews at these companies" }
    );
  } else if (response.includes("```comp")) {
    chips.push(
      { label: "Draft negotiation script", prompt: "Draft a salary negotiation script based on this comp data" },
      { label: "Prep for interview", prompt: "Help me prepare for the interview" },
      { label: "Find similar roles", prompt: "Find me similar roles at other companies" }
    );
  } else if (response.includes("```coverletter")) {
    chips.push(
      { label: "Make it shorter", prompt: "Make the cover letter more concise" },
      { label: "More technical focus", prompt: "Rewrite with more emphasis on technical skills" },
      { label: "Prep for interview", prompt: "Now help me prepare for the interview" }
    );
  } else {
    chips.push(
      { label: "Find jobs", prompt: "Find me software engineer roles in Atlanta" },
      { label: "Review my resume", prompt: "Review my resume and suggest improvements" },
      { label: "Interview tips", prompt: "Give me general interview tips for tech roles" }
    );
  }

  return chips;
}
