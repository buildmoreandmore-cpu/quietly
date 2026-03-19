"use client";

import { useState } from "react";
import { Application } from "@/lib/types";
import { useTracker } from "@/hooks/useTracker";
import StatusDropdown from "./StatusDropdown";

interface Props {
  application: Application;
}

const STATUS_PROGRESS: Record<string, number> = {
  saved: 10,
  applied: 30,
  screening: 50,
  interview: 70,
  offer: 90,
  rejected: 100,
  withdrawn: 100,
};

export default function TrackerCard({ application }: Props) {
  const { updateNotes, removeApp } = useTracker();
  const [showNotes, setShowNotes] = useState(false);
  const progress = STATUS_PROGRESS[application.status] || 0;

  return (
    <div className="bg-background border border-border rounded-lg p-3 group hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate text-foreground">
            {application.job.title}
          </div>
          <div className="text-xs text-muted truncate">
            {application.job.company} &middot; {application.job.location}
          </div>
        </div>
        <button
          onClick={() => removeApp(application.id)}
          className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Remove"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              application.status === "rejected"
                ? "bg-red-400"
                : application.status === "withdrawn"
                ? "bg-gray-400"
                : "bg-accent"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <StatusDropdown application={application} />
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-[10px] text-muted hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          {showNotes ? "Hide notes" : "Notes"}
        </button>
        <span className="text-[10px] text-muted font-medium">
          {application.job.salary}
        </span>
      </div>

      {showNotes && (
        <textarea
          value={application.notes}
          onChange={(e) => updateNotes(application.id, e.target.value)}
          placeholder="Add notes..."
          className="mt-2 w-full bg-surface border border-border rounded-lg p-2 text-xs resize-none h-16 focus:outline-none focus:border-accent/50 text-foreground"
        />
      )}
    </div>
  );
}
