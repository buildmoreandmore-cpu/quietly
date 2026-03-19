"use client";

import { useQuietlyStore } from "@/store/quietly";
import { useChat } from "@/hooks/useChat";

export default function QuickChips() {
  const { chips } = useQuietlyStore();
  const { sendMessage, isStreaming } = useChat();

  if (chips.length === 0 || isStreaming) return null;

  return (
    <div className="px-4 pb-2 flex gap-2 flex-wrap">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => sendMessage(chip.prompt)}
          className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
