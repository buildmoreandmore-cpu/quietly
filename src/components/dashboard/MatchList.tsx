"use client";

import { useQuietlyStore } from "@/store/quietly";
import type { Match } from "@/lib/types";

function statusBadge(status: Match["status"]) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-blue-50", text: "text-blue-600", label: "New" },
    outreach_sent: { bg: "bg-yellow-50", text: "text-yellow-600", label: "Outreach sent" },
    responded: { bg: "bg-green-50", text: "text-green-600", label: "Responded" },
    intro_made: { bg: "bg-accent/10", text: "text-accent", label: "Intro made" },
    passed: { bg: "bg-gray-100", text: "text-gray-500", label: "Passed" },
    expired: { bg: "bg-gray-100", text: "text-gray-400", label: "Expired" },
  };
  const s = map[status] || map.new;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function gradeColor(grade: string) {
  switch (grade) {
    case "A": return "bg-green-50 text-green-700";
    case "B": return "bg-blue-50 text-blue-700";
    case "C": return "bg-yellow-50 text-yellow-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

export default function MatchList() {
  const { matches } = useQuietlyStore();

  if (matches.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="font-semibold text-foreground mb-1">No matches yet</h3>
        <p className="text-sm text-muted">
          Our engine runs nightly. Once we find roles that fit your profile,
          they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Your matches
      </h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {match.title}
                  </h3>
                  {statusBadge(match.status)}
                </div>
                <p className="text-sm text-accent font-medium">{match.company}</p>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted">
                  {match.location && <span>{match.location}</span>}
                  {match.salaryRange && <span>· {match.salaryRange}</span>}
                  {match.jobType && <span>· {match.jobType}</span>}
                </div>
                <p className="text-xs text-muted mt-2">{match.whyItFits}</p>
                {match.oneConcern && (
                  <p className="text-xs text-muted/70 italic mt-1">
                    {match.oneConcern}
                  </p>
                )}
              </div>
              <div className="text-center flex-shrink-0">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor(match.matchGrade)}`}>
                  {match.matchGrade}
                </span>
                <p className="text-[10px] text-muted mt-0.5">
                  {match.matchScore}%
                </p>
              </div>
            </div>
            {match.url && match.url !== "#" && (
              <a
                href={match.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-accent hover:underline"
              >
                View listing
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
