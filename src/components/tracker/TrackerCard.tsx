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
    <div className="bg-surface border border-border rounded-lg p-3 group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">
            {application.job.title}
          </div>
          <div className="text-xs text-muted truncate">
            {application.job.company} &middot; {application.job.location}
          </div>
        </div>
        <button
          onClick={() => removeApp(application.id)}
          className="text-muted hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              application.status === "rejected"
                ? "bg-red-500"
                : application.status === "withdrawn"
                ? "bg-muted"
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
          className="text-[10px] text-muted hover:text-foreground transition-colors"
        >
          {showNotes ? "Hide notes" : "Notes"}
        </button>
        <span className="text-[10px] text-muted">
          {application.job.salary}
        </span>
      </div>

      {showNotes && (
        <textarea
          value={application.notes}
          onChange={(e) => updateNotes(application.id, e.target.value)}
          placeholder="Add notes..."
          className="mt-2 w-full bg-background border border-border rounded-lg p-2 text-xs resize-none h-16 focus:outline-none focus:border-accent/50"
        />
      )}
    </div>
  );
}
