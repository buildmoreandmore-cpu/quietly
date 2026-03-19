"use client";

import { useTracker } from "@/hooks/useTracker";
import TrackerCard from "./TrackerCard";

export default function TrackerList() {
  const { applications } = useTracker();

  if (applications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-xs text-muted text-center">
          No tracked jobs yet. Find jobs in the chat and click Track to add them
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {applications.map((app) => (
        <TrackerCard key={app.id} application={app} />
      ))}
    </div>
  );
}
