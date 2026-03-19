"use client";

import { useQuietlyStore } from "@/store/quietly";

export default function TopBar() {
  const { resume, blockedEmployers } = useQuietlyStore();

  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-accent">Q</span>uietly
        </h1>
        <span className="text-xs text-muted hidden sm:inline">
          Private job search
        </span>
      </div>
      <div className="flex items-center gap-2">
        {resume && (
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
            Resume loaded
          </span>
        )}
        {blockedEmployers.length > 0 && (
          <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
            {blockedEmployers.length} blocked
          </span>
        )}
      </div>
    </div>
  );
}
