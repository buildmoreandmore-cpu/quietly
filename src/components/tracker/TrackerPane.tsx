"use client";

import TrackerStats from "./TrackerStats";
import TrackerList from "./TrackerList";

export default function TrackerPane() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold">Job Tracker</h2>
      </div>
      <TrackerStats />
      <TrackerList />
    </div>
  );
}
