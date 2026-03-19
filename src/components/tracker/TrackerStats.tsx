"use client";

import { useTracker } from "@/hooks/useTracker";

const STAT_CONFIG = [
  { key: "saved", label: "Saved", color: "text-blue-400" },
  { key: "applied", label: "Applied", color: "text-yellow-400" },
  { key: "screening", label: "Screen", color: "text-orange-400" },
  { key: "interview", label: "Interview", color: "text-purple-400" },
  { key: "offer", label: "Offer", color: "text-accent" },
] as const;

export default function TrackerStats() {
  const { stats } = useTracker();

  return (
    <div className="flex gap-1 p-3 border-b border-border shrink-0">
      {STAT_CONFIG.map(({ key, label, color }) => (
        <div
          key={key}
          className="flex-1 text-center bg-surface rounded-lg py-2"
        >
          <div className={`text-base font-semibold ${color}`}>
            {stats[key]}
          </div>
          <div className="text-[9px] text-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}
