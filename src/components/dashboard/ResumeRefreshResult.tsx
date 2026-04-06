"use client";

import { RefreshResult } from "@/lib/types";

interface Props {
  result: RefreshResult;
  onAccept: () => void;
  onRevert: () => void;
}

export default function ResumeRefreshResult({
  result,
  onAccept,
  onRevert,
}: Props) {
  const { reviewFeedback } = result;
  const { flags, overallVerdict, finalResume } = reviewFeedback;

  return (
    <div className="space-y-6">
      {/* Verdict banner */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
          overallVerdict === "approved"
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        <span className="text-lg">
          {overallVerdict === "approved" ? "\u2713" : "\u26A0"}
        </span>
        <span>
          {overallVerdict === "approved"
            ? "Resume passed quality review — no inflation detected."
            : `GPT flagged ${flags.length} issue${flags.length === 1 ? "" : "s"} and corrected them.`}
        </span>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">
            What was caught
          </h3>
          {flags.map((flag, i) => (
            <div
              key={i}
              className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 space-y-1.5"
            >
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                {flag.section}
              </p>
              <p className="text-xs text-muted line-through">{flag.original}</p>
              <p className="text-xs text-foreground">{flag.suggestion}</p>
              <p className="text-[10px] text-amber-600">{flag.issue}</p>
            </div>
          ))}
        </div>
      )}

      {/* Preview of final resume */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">
          Final resume preview
        </h3>

        {finalResume.summary && (
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide mb-1">
              Summary
            </p>
            <p className="text-sm text-foreground">{finalResume.summary}</p>
          </div>
        )}

        {finalResume.experience.map((exp, i) => (
          <div
            key={i}
            className="border-l-2 border-border pl-3 space-y-1"
          >
            <p className="text-sm font-medium text-foreground">
              {exp.title} at {exp.company}
            </p>
            <p className="text-[10px] text-muted">
              {exp.location} | {exp.dates}
            </p>
            <ul className="space-y-0.5">
              {exp.bullets.map((bullet, j) => (
                <li key={j} className="text-xs text-muted">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          onClick={onAccept}
          className="flex-1 bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
        >
          Accept resume
        </button>
        <button
          onClick={onRevert}
          className="flex-1 border border-border text-muted py-2.5 rounded-lg text-sm hover:text-foreground hover:border-foreground/20 transition-colors"
        >
          Revert
        </button>
      </div>
    </div>
  );
}
