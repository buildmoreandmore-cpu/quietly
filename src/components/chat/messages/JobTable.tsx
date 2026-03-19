"use client";

import { Job } from "@/lib/types";
import { useTracker } from "@/hooks/useTracker";

interface Props {
  jobs: Job[];
}

export default function JobTable({ jobs }: Props) {
  const { trackJob, applications } = useTracker();

  return (
    <div className="my-3 space-y-2">
      {jobs.map((job) => {
        const isTracked = applications.some((a) => a.job.id === job.id);
        return (
          <div
            key={job.id}
            className="bg-background border border-border rounded-lg p-3 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-sm text-foreground">{job.title}</div>
                <div className="text-xs text-muted mt-0.5">
                  {job.company} &middot; {job.location}
                </div>
                <div className="text-xs text-accent mt-1 font-medium">{job.salary}</div>
                {job.score > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${job.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted">{job.score}% match</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => trackJob(job)}
                disabled={isTracked}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  isTracked
                    ? "bg-accent/10 text-accent cursor-default"
                    : "bg-accent text-white hover:bg-accent-dim"
                }`}
              >
                {isTracked ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Tracked
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Track
                  </>
                )}
              </button>
            </div>
            {job.url !== "#" && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent hover:underline mt-1.5 inline-flex items-center gap-0.5"
              >
                View posting
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
