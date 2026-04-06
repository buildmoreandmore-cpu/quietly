"use client";

import { useQuietlyStore } from "@/store/quietly";

interface Props {
  onEditResume?: () => void;
}

export default function ProfileCard({ onEditResume }: Props) {
  const {
    resume,
    targetTitles,
    targetLocations,
    salaryFloor,
    jobType,
    blockedEmployers,
    isActive,
  } = useQuietlyStore();

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Your profile</h2>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isActive ? "Active in pool" : "Paused"}
        </span>
      </div>

      {resume ? (
        <div>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-foreground">{resume.name}</p>
            {onEditResume && (
              <button
                onClick={onEditResume}
                className="text-[10px] text-accent hover:text-accent-dim font-medium"
              >
                Edit &amp; refresh
              </button>
            )}
          </div>
          <p className="text-xs text-muted mt-1 line-clamp-2">
            {resume.summary}
          </p>
          {resume.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {resume.skills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {resume.skills.length > 8 && (
                <span className="text-[10px] text-muted">
                  +{resume.skills.length - 8}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted">No resume uploaded yet.</p>
      )}

      <div className="border-t border-border pt-3 space-y-2">
        {targetTitles.length > 0 && (
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide">
              Looking for
            </p>
            <p className="text-xs text-foreground">
              {targetTitles.join(", ")}
            </p>
          </div>
        )}
        {targetLocations.length > 0 && (
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide">
              Locations
            </p>
            <p className="text-xs text-foreground">
              {targetLocations.join(", ")}
            </p>
          </div>
        )}
        {salaryFloor > 0 && (
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide">
              Salary floor
            </p>
            <p className="text-xs text-foreground">
              ${salaryFloor.toLocaleString()}
            </p>
          </div>
        )}
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wide">
            Type
          </p>
          <p className="text-xs text-foreground capitalize">{jobType}</p>
        </div>
        {blockedEmployers.length > 0 && (
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide">
              Blocked
            </p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {blockedEmployers.map((emp) => (
                <span
                  key={emp}
                  className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full"
                >
                  {emp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
