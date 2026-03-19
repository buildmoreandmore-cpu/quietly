"use client";

import { useState, useRef, useEffect } from "react";
import { Application, AppStatus } from "@/lib/types";
import { useTracker } from "@/hooks/useTracker";

interface Props {
  application: Application;
}

const STATUSES: { value: AppStatus; label: string; color: string }[] = [
  { value: "saved", label: "Saved", color: "bg-blue-400" },
  { value: "applied", label: "Applied", color: "bg-yellow-400" },
  { value: "screening", label: "Screening", color: "bg-orange-400" },
  { value: "interview", label: "Interview", color: "bg-purple-400" },
  { value: "offer", label: "Offer", color: "bg-green-400" },
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
        className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md bg-background border border-border hover:border-accent/30 transition-colors"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.color}`} />
        {current.label}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 py-1 min-w-[120px]">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                updateStatus(application.id, status.value);
                setOpen(false);
              }}
              className={`w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-hover transition-colors ${
                application.status === status.value ? "text-accent" : "text-foreground"
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
