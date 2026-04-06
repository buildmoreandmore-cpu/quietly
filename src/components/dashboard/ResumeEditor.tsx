"use client";

import { useState, useEffect } from "react";
import { ParsedResume } from "@/lib/types";
import { useResumeRefresh } from "@/hooks/useResumeRefresh";
import ResumeRefreshResult from "./ResumeRefreshResult";

interface Props {
  resume: ParsedResume;
  onClose: () => void;
  onSave: (resume: ParsedResume) => void;
}

export default function ResumeEditor({ resume, onClose, onSave }: Props) {
  const [edited, setEdited] = useState<ParsedResume>(
    JSON.parse(JSON.stringify(resume))
  );
  const {
    isRefreshing,
    refreshResult,
    error,
    stage,
    refreshResume,
    acceptRefresh,
    discardRefresh,
  } = useResumeRefresh();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const updateField = (field: keyof ParsedResume, value: unknown) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperience = (
    index: number,
    field: string,
    value: unknown
  ) => {
    setEdited((prev) => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const addExperience = () => {
    setEdited((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", location: "", dates: "", bullets: [""] },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setEdited((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateBullet = (expIdx: number, bulletIdx: number, value: string) => {
    setEdited((prev) => {
      const exp = [...prev.experience];
      const bullets = [...exp[expIdx].bullets];
      bullets[bulletIdx] = value;
      exp[expIdx] = { ...exp[expIdx], bullets };
      return { ...prev, experience: exp };
    });
  };

  const addBullet = (expIdx: number) => {
    setEdited((prev) => {
      const exp = [...prev.experience];
      exp[expIdx] = {
        ...exp[expIdx],
        bullets: [...exp[expIdx].bullets, ""],
      };
      return { ...prev, experience: exp };
    });
  };

  const removeBullet = (expIdx: number, bulletIdx: number) => {
    setEdited((prev) => {
      const exp = [...prev.experience];
      exp[expIdx] = {
        ...exp[expIdx],
        bullets: exp[expIdx].bullets.filter((_, i) => i !== bulletIdx),
      };
      return { ...prev, experience: exp };
    });
  };

  const handleAcceptRefresh = () => {
    if (refreshResult) {
      const finalResume = refreshResult.reviewFeedback.finalResume;
      acceptRefresh(finalResume);
      onSave(finalResume);
      onClose();
    }
  };

  const handleDiscard = () => {
    discardRefresh();
  };

  // Skill tag input
  const [skillInput, setSkillInput] = useState("");
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !edited.skills.includes(trimmed)) {
      updateField("skills", [...edited.skills, trimmed]);
      setSkillInput("");
    }
  };
  const removeSkill = (skill: string) => {
    updateField(
      "skills",
      edited.skills.filter((s) => s !== skill)
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-background border-l border-border z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Edit resume
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Show refresh result if available */}
          {refreshResult ? (
            <ResumeRefreshResult
              result={refreshResult}
              onAccept={handleAcceptRefresh}
              onRevert={handleDiscard}
            />
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                  Summary
                </label>
                <textarea
                  value={edited.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  rows={3}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                  Skills
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {edited.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill..."
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                  />
                  <button
                    onClick={addSkill}
                    className="text-xs text-accent hover:text-accent-dim font-medium px-3"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wide">
                    Experience
                  </label>
                  <button
                    onClick={addExperience}
                    className="text-xs text-accent hover:text-accent-dim font-medium"
                  >
                    + Add role
                  </button>
                </div>

                <div className="space-y-4">
                  {edited.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="bg-surface border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            value={exp.title}
                            onChange={(e) =>
                              updateExperience(i, "title", e.target.value)
                            }
                            placeholder="Job title"
                            className="bg-background border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                          />
                          <input
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(i, "company", e.target.value)
                            }
                            placeholder="Company"
                            className="bg-background border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                          />
                          <input
                            value={exp.location}
                            onChange={(e) =>
                              updateExperience(i, "location", e.target.value)
                            }
                            placeholder="Location"
                            className="bg-background border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                          />
                          <input
                            value={exp.dates}
                            onChange={(e) =>
                              updateExperience(i, "dates", e.target.value)
                            }
                            placeholder="Dates (e.g. Jan 2020 — Present)"
                            className="bg-background border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                          />
                        </div>
                        {edited.experience.length > 1 && (
                          <button
                            onClick={() => removeExperience(i)}
                            className="ml-2 text-muted hover:text-red-500 transition-colors text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Bullets */}
                      <div className="space-y-1.5">
                        {exp.bullets.map((bullet, j) => (
                          <div key={j} className="flex gap-1.5 items-start">
                            <span className="text-muted text-xs mt-2">
                              &bull;
                            </span>
                            <input
                              value={bullet}
                              onChange={(e) =>
                                updateBullet(i, j, e.target.value)
                              }
                              className="flex-1 bg-background border border-border rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent/50 text-foreground"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                onClick={() => removeBullet(i, j)}
                                className="text-muted hover:text-red-500 text-xs mt-1"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addBullet(i)}
                          className="text-[10px] text-accent hover:text-accent-dim font-medium"
                        >
                          + Add bullet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                  Education
                </label>
                <div className="space-y-2">
                  {edited.education.map((edu, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
                      <input
                        value={edu.degree}
                        onChange={(e) => {
                          const education = [...edited.education];
                          education[i] = {
                            ...education[i],
                            degree: e.target.value,
                          };
                          updateField("education", education);
                        }}
                        placeholder="Degree"
                        className="bg-surface border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                      />
                      <input
                        value={edu.school}
                        onChange={(e) => {
                          const education = [...edited.education];
                          education[i] = {
                            ...education[i],
                            school: e.target.value,
                          };
                          updateField("education", education);
                        }}
                        placeholder="School"
                        className="bg-surface border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                      />
                      <input
                        value={edu.year}
                        onChange={(e) => {
                          const education = [...edited.education];
                          education[i] = {
                            ...education[i],
                            year: e.target.value,
                          };
                          updateField("education", education);
                        }}
                        placeholder="Year"
                        className="bg-surface border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {edited.certifications.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                    Certifications
                  </label>
                  {edited.certifications.map((cert, i) => (
                    <input
                      key={i}
                      value={cert}
                      onChange={(e) => {
                        const certs = [...edited.certifications];
                        certs[i] = e.target.value;
                        updateField("certifications", certs);
                      }}
                      className="w-full bg-surface border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent/50 text-foreground mb-1.5"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {!refreshResult && (
          <div className="px-5 py-4 border-t border-border flex gap-3">
            <button
              onClick={() => {
                onSave(edited);
                onClose();
              }}
              className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-surface transition-colors"
            >
              Save changes
            </button>
            <button
              onClick={() => refreshResume(edited)}
              disabled={isRefreshing}
              className="flex-1 bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRefreshing ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {stage === "rewriting"
                    ? "Rewriting..."
                    : "Reviewing for quality..."}
                </>
              ) : (
                "Refresh with AI"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
