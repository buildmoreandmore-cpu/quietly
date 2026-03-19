"use client";

import { useQuietlyStore } from "@/store/quietly";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import ChatPane from "../chat/ChatPane";
import TrackerPane from "../tracker/TrackerPane";

export default function AppShell() {
  const { mobileView } = useQuietlyStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: side by side */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <div className="flex-1 min-w-0">
            <ChatPane />
          </div>
          <div className="w-[340px] border-l border-border">
            <TrackerPane />
          </div>
        </div>

        {/* Mobile: tabbed */}
        <div className="flex md:hidden flex-1 overflow-hidden">
          {mobileView === "chat" ? <ChatPane /> : <TrackerPane />}
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
