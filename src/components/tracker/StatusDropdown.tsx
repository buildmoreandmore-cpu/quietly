"use client";

import { useState, useRef, useEffect } from "react";
import { Application, AppStatus } from "@/lib/types";
import { useTracker } from "@/hooks/useTracker";

interface Props {
  application: Application;
}

const STATUSES: { value: AppStatus; label: string; color: string }[] = [
  { value: "saved", label: "Saved", color: "bg-blue-500" },
  { value: "applied", label: "Applied", color: "bg-amber-500" },
  { value: "screening", label: "Screening", color: "bg-orange-500" },
  { value: "interview", label: "Interview", color: "bg-purple-500" },
  { value: "offer", label: "Offer", color: "bg-indigo-500" },
  { value: "rejected", label: "Rejected", color: "bg-red-400" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-gray-400" },
];

export default function StatusDropdown({ application }: Props) {
  const { updateStatus } = useTracker();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = STATUSES.find((s) => s.value === application.status) || STATUSES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md bg-surface border border-border hover:border-accent/30 transition-colors text-foreground"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.color}`} />
        {current.label}
        <svg className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                updateStatus(application.id, status.value);
                setOpen(false);
              }}
              className={`w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface transition-colors ${
                application.status === status.value ? "text-accent font-medium" : "text-foreground"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
              {status.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
