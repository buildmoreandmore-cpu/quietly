"use client";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import QuickChips from "./QuickChips";

export default function ChatPane() {
  return (
    <div className="flex flex-col h-full w-full">
      <MessageList />
      <QuickChips />
      <ChatInput />
    </div>
  );
}
