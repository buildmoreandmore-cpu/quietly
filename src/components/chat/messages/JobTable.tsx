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
            className="bg-background border border-border rounded-lg p-3 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-sm">{job.title}</div>
                <div className="text-xs text-muted mt-0.5">
                  {job.company} &middot; {job.location}
                </div>
                <div className="text-xs text-accent/80 mt-1">{job.salary}</div>
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
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  isTracked
                    ? "bg-accent/10 text-accent cursor-default"
                    : "bg-accent text-background hover:bg-accent-dim"
                }`}
              >
                {isTracked ? "Tracked" : "Track"}
              </button>
            </div>
            {job.url !== "#" && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent underline mt-1.5 inline-block"
              >
                View posting
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
