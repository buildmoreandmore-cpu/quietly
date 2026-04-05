"use client";

import { useState, useRef } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { useResume } from "@/hooks/useResume";
import { createSupabaseBrowser } from "@/lib/supabase";

export default function OnboardingModal() {
  const {
    showOnboarding,
    setShowOnboarding,
    setTargetTitles,
    setTargetLocations,
    setSalaryFloor,
    setBlockedEmployers,
    setJobType,
  } = useQuietlyStore();
  const { uploadResume } = useResume();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [resumeName, setResumeName] = useState("");

  // Step 2: Preferences
  const [titles, setTitles] = useState("");
  const [locations, setLocations] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("full-time");

  // Step 3: Blocked employers
  const [blockedInput, setBlockedInput] = useState("");
  const [blockedList, setBlockedList] = useState<string[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  if (!showOnboarding) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const resume = await uploadResume(file);
      setResumeName(resume.name);
    } catch {
      // handled by hook
    }
    setUploading(false);
  };

  const addBlocked = () => {
    if (blockedInput.trim()) {
      setBlockedList([...blockedList, blockedInput.trim()]);
      setBlockedInput("");
    }
  };

  const finish = async () => {
    // Parse preferences
    const titleArr = titles
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const locArr = locations
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    const salaryNum = salary ? parseInt(salary.replace(/\D/g, "")) || 0 : 0;

    setTargetTitles(titleArr);
    setTargetLocations(locArr);
    setSalaryFloor(salaryNum);
    setJobType(type);
    setBlockedEmployers(blockedList);
    setShowOnboarding(false);

    // Persist to Supabase
    try {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            target_titles: titleArr,
            target_locations: locArr,
            salary_floor: salaryNum,
            job_type: type,
            blocked_employers: blockedList,
            onboarded: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("Failed to persist onboarding:", err);
    }
  };

  const dismiss = () => {
    setShowOnboarding(false);
    // Mark as onboarded even if skipped
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .update({ onboarded: true, updated_at: new Date().toISOString() })
          .eq("id", user.id);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>

        {/* Step 1: Resume */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-1 text-foreground">
              Upload your resume
            </h2>
            <p className="text-sm text-muted mb-4">
              We&apos;ll parse it and use it to match you with the right roles.
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-muted">Parsing resume...</p>
                </div>
              ) : resumeName ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-accent font-medium">
                    Loaded: {resumeName}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-muted">Click to upload PDF</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(2)} className="text-sm text-muted hover:text-foreground transition-colors">
                Skip
              </button>
              <button onClick={() => setStep(2)} className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Preferences */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-1 text-foreground">
              What are you looking for?
            </h2>
            <p className="text-sm text-muted mb-4">
              Tell us your ideal roles so we can match you better.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Target job titles (comma-separated)
                </label>
                <input
                  value={titles}
                  onChange={(e) => setTitles(e.target.value)}
                  placeholder="e.g. Senior Engineer, Staff Engineer, Tech Lead"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Preferred locations (comma-separated)
                </label>
                <input
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  placeholder="e.g. Remote, Atlanta GA, New York NY"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Minimum salary
                  </label>
                  <input
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 120000"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Job type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote only</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(1)} className="text-sm text-muted hover:text-foreground transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Blocked Employers */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-1 text-foreground">
              Block employers
            </h2>
            <p className="text-sm text-muted mb-4">
              Companies we should never contact on your behalf (e.g. your
              current employer).
            </p>
            <div className="flex gap-2 mb-3">
              <input
                value={blockedInput}
                onChange={(e) => setBlockedInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addBlocked()}
                placeholder="Company name"
                className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 text-foreground"
              />
              <button
                onClick={addBlocked}
                className="text-sm bg-surface border border-border px-3 py-2 rounded-lg hover:border-accent/30 transition-colors text-foreground"
              >
                Add
              </button>
            </div>
            {blockedList.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {blockedList.map((name) => (
                  <span
                    key={name}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {name}
                    <button
                      onClick={() => setBlockedList(blockedList.filter((n) => n !== name))}
                      className="hover:text-red-800"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(2)} className="text-sm text-muted hover:text-foreground transition-colors">
                Back
              </button>
              <button
                onClick={finish}
                className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors"
              >
                Start matching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
