"use client";

import { useQuietlyStore } from "@/store/quietly";

export default function TopBar() {
  const { resume, blockedEmployers } = useQuietlyStore();

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          <span className="text-accent">Q</span>uietly
        </h1>
        <span className="text-xs text-muted hidden sm:inline">
          Private job search
        </span>
      </div>
      <div className="flex items-center gap-2">
        {resume && (
          <span className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Resume loaded
          </span>
        )}
        {blockedEmployers.length > 0 && (
          <span className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {blockedEmployers.length} blocked
          </span>
        )}
      </div>
    </div>
  );
}
