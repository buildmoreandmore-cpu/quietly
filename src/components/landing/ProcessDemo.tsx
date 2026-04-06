"use client";

import { useEffect, useState, useCallback } from "react";

/* ── Stage config ──────────────────────────────────────────── */

const STAGES = [
  { id: "upload", label: "You join the pool", sublabel: "Upload once. We handle the rest.", duration: 4500 },
  { id: "scan", label: "We scan while you sleep", sublabel: "Every night. Thousands of roles.", duration: 5500 },
  { id: "outreach", label: "Outreach goes out", sublabel: "Personalized. Anonymous.", duration: 4500 },
  { id: "notify", label: "You get pinged", sublabel: "Only when it matters.", duration: 3500 },
] as const;

type StageId = (typeof STAGES)[number]["id"];

/* ── Resume lines (mock document) ──────────────────────────── */

const RESUME_LINES = [
  { type: "name", text: "Jordan Mitchell" },
  { type: "sub", text: "Senior Financial Analyst  •  New York, NY" },
  { type: "spacer", text: "" },
  { type: "heading", text: "EXPERIENCE" },
  { type: "job", text: "Goldman Sachs — Vice President, FP&A" },
  { type: "detail", text: "Led quarterly forecasting for $2.4B portfolio" },
  { type: "detail", text: "Built financial models adopted across 3 divisions" },
  { type: "spacer", text: "" },
  { type: "job", text: "Deloitte — Senior Consultant" },
  { type: "detail", text: "Managed 12-person team on Fortune 500 engagements" },
  { type: "spacer", text: "" },
  { type: "heading", text: "SKILLS" },
  { type: "detail", text: "Financial Modeling • Excel • Salesforce • SQL • Tableau" },
];

const EXTRACTED_SKILLS = ["Financial Modeling", "Team Leadership", "FP&A", "Excel", "Salesforce", "SQL"];

/* ── Scan job stream ───────────────────────────────────────── */

const SCAN_JOBS = [
  { title: "Marketing Coordinator", company: "Nike", fit: 32, pass: true },
  { title: "Dental Hygienist", company: "Aspen Dental", fit: 8, pass: true },
  { title: "Senior Financial Analyst", company: "JPMorgan Chase", fit: 92, pass: false },
  { title: "Retail Associate", company: "Target", fit: 11, pass: true },
  { title: "IT Support Specialist", company: "IBM", fit: 28, pass: true },
  { title: "Operations Manager", company: "Kaiser Permanente", fit: 88, pass: false },
  { title: "Barista", company: "Starbucks", fit: 5, pass: true },
  { title: "Truck Driver", company: "FedEx", fit: 3, pass: true },
  { title: "Project Coordinator", company: "Deloitte", fit: 81, pass: false },
  { title: "Nurse Practitioner", company: "HCA Healthcare", fit: 14, pass: true },
  { title: "Data Entry Clerk", company: "Manpower", fit: 22, pass: true },
  { title: "Sous Chef", company: "Marriott", fit: 6, pass: true },
];

const MOCK_OUTREACH = {
  to: "Sarah Chen — Hiring Manager, JPMorgan Chase",
  subject: "Strong candidate for Senior Financial Analyst — 92% match",
  lines: [
    "Hi Sarah,",
    "",
    "I'm reaching out on behalf of a candidate whose",
    "background is a strong fit for your open role.",
    "",
    "They bring 8+ years of financial analysis experience,",
    "advanced modeling skills, and a track record of",
    "driving strategic decisions at the executive level.",
    "",
    "Would you be open to a confidential introduction?",
  ],
};

/* ── Component ─────────────────────────────────────────────── */

export default function ProcessDemo() {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Upload sub-state
  const [uploadPhase, setUploadPhase] = useState(0); // 0=dropping, 1=landed, 2=scanning, 3=extracting, 4=done
  const [scanLineY, setScanLineY] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);

  // Scan sub-state
  const [scanJobIndex, setScanJobIndex] = useState(0);
  const [matches, setMatches] = useState<typeof SCAN_JOBS>([]);
  const [scanCount, setScanCount] = useState(0);

  // Outreach sub-state
  const [outreachLines, setOutreachLines] = useState(0);

  // Notify sub-state
  const [notifyPhase, setNotifyPhase] = useState(0);

  const resetSubAnimations = useCallback(() => {
    setUploadPhase(0);
    setScanLineY(0);
    setExtractedCount(0);
    setScanJobIndex(0);
    setMatches([]);
    setScanCount(0);
    setOutreachLines(0);
    setNotifyPhase(0);
  }, []);

  // Main stage timer
  useEffect(() => {
    if (isPaused) return;
    const stage = STAGES[activeStage];
    const interval = 50;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + (interval / stage.duration) * 100;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            resetSubAnimations();
            setActiveStage((s) => (s + 1) % STAGES.length);
            setProgress(0);
          }, 400);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [activeStage, isPaused, resetSubAnimations]);

  // Sub-animations
  useEffect(() => {
    if (isPaused) return;
    const stageId = STAGES[activeStage].id;

    if (stageId === "upload") {
      // Phase 0: resume floating down (0-600ms)
      // Phase 1: resume landed (600ms)
      // Phase 2: scan line moving down (600-2400ms)
      // Phase 3: extracting skills (2400-3600ms)
      // Phase 4: done (3600ms+)
      const t1 = setTimeout(() => setUploadPhase(1), 500);
      const t2 = setTimeout(() => setUploadPhase(2), 800);

      // Scan line animation
      let scanY = 0;
      const scanInterval = setTimeout(() => {
        const iv = setInterval(() => {
          scanY += 8;
          if (scanY > 100) {
            clearInterval(iv);
            setUploadPhase(3);
            // Extract skills one by one
            let skillIdx = 0;
            const skillIv = setInterval(() => {
              skillIdx++;
              setExtractedCount(skillIdx);
              if (skillIdx >= EXTRACTED_SKILLS.length) {
                clearInterval(skillIv);
                setTimeout(() => setUploadPhase(4), 300);
              }
            }, 150);
          }
          setScanLineY(scanY);
        }, 40);
      }, 900);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(scanInterval); };
    }

    if (stageId === "scan") {
      // Stream jobs through one by one
      let jobIdx = 0;
      let count = 0;
      const iv = setInterval(() => {
        if (jobIdx < SCAN_JOBS.length) {
          setScanJobIndex(jobIdx);
          count += Math.floor(Math.random() * 300) + 100;
          setScanCount(count);

          const job = SCAN_JOBS[jobIdx];
          if (!job.pass) {
            setMatches((prev) => [...prev, job]);
          }
          jobIdx++;
        } else {
          clearInterval(iv);
          setScanCount(2847);
        }
      }, 350);

      return () => clearInterval(iv);
    }

    if (stageId === "outreach") {
      let line = 0;
      const iv = setInterval(() => {
        line++;
        setOutreachLines(line);
        if (line >= MOCK_OUTREACH.lines.length) clearInterval(iv);
      }, 280);
      return () => clearInterval(iv);
    }

    if (stageId === "notify") {
      const t1 = setTimeout(() => setNotifyPhase(1), 800);
      const t2 = setTimeout(() => setNotifyPhase(2), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [activeStage, isPaused]);

  const stageId = STAGES[activeStage].id as StageId;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Stage indicators ───────────────────────── */}
      <div className="flex gap-2 mb-8">
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => { resetSubAnimations(); setActiveStage(i); setProgress(0); }}
            className={`flex-1 text-left transition-all duration-300 ${
              i === activeStage ? "opacity-100" : "opacity-40 hover:opacity-60"
            }`}
          >
            <div className="h-1 rounded-full bg-stone-200 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-100 ease-linear"
                style={{ width: i < activeStage ? "100%" : i === activeStage ? `${progress}%` : "0%" }}
              />
            </div>
            <div className="text-xs font-semibold text-foreground mb-0.5 hidden sm:block">{stage.label}</div>
            <div className="text-[10px] text-stone-400 hidden sm:block">{stage.sublabel}</div>
          </button>
        ))}
      </div>

      {/* ── Demo screen ────────────────────────────── */}
      <div className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xl shadow-stone-200/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-100 bg-stone-50/80">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-[10px] text-stone-400 bg-stone-100 px-3 py-0.5 rounded-md">quietly.app</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-[400px] sm:h-[440px] overflow-hidden bg-white">

          {/* ── UPLOAD ─────────────────────────────── */}
          <div className={`absolute inset-0 p-5 sm:p-8 transition-all duration-500 ${
            stageId === "upload" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="flex gap-6 h-full items-center justify-center">
              {/* Resume document */}
              <div className="relative w-[220px] sm:w-[240px] flex-shrink-0">
                <div className={`bg-white border border-stone-200 rounded-lg shadow-lg p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  uploadPhase === 0 ? "opacity-0 -translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"
                }`}>
                  {/* Resume content lines */}
                  <div className="space-y-1.5 relative overflow-hidden">
                    {RESUME_LINES.map((line, i) => (
                      <div key={i} className={
                        line.type === "name" ? "text-[11px] font-bold text-stone-900" :
                        line.type === "sub" ? "text-[8px] text-stone-400 mb-1" :
                        line.type === "heading" ? "text-[8px] font-bold text-stone-600 tracking-wider pt-1 border-b border-stone-100 pb-0.5" :
                        line.type === "job" ? "text-[9px] font-semibold text-stone-800" :
                        line.type === "detail" ? "text-[8px] text-stone-500 pl-2" :
                        "h-1"
                      }>
                        {line.text}
                      </div>
                    ))}

                    {/* Scan line overlay */}
                    {uploadPhase === 2 && (
                      <div
                        className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.3)] transition-all duration-75"
                        style={{ top: `${Math.min(scanLineY, 100)}%` }}
                      />
                    )}
                  </div>

                  {/* PDF footer */}
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-2">
                    <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    </svg>
                    <span className="text-[8px] text-stone-400">resume_2024.pdf</span>
                  </div>
                </div>
              </div>

              {/* Right side: extracted data */}
              <div className="flex-1 max-w-[240px]">
                {/* Phase label */}
                <div className={`mb-4 transition-all duration-500 ${uploadPhase >= 2 ? "opacity-100" : "opacity-0"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {uploadPhase < 4 ? (
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    <span className="text-xs font-semibold text-stone-700">
                      {uploadPhase < 3 ? "Reading resume..." : uploadPhase < 4 ? "Extracting profile..." : "Profile built"}
                    </span>
                  </div>
                </div>

                {/* Extracted skills */}
                <div className={`mb-5 transition-all duration-500 ${uploadPhase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider mb-2">Skills found</div>
                  <div className="flex flex-wrap gap-1.5">
                    {EXTRACTED_SKILLS.map((skill, i) => (
                      <span
                        key={skill}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
                          i < extractedCount
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 opacity-100 translate-y-0"
                            : "bg-stone-50 text-stone-300 border-stone-100 opacity-0 translate-y-2"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className={`grid grid-cols-2 gap-1.5 transition-all duration-500 ${uploadPhase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                  {[
                    { label: "Target", value: "Financial Analyst" },
                    { label: "Location", value: "Remote / NYC" },
                    { label: "Floor", value: "$95k+" },
                    { label: "Blocked", value: "Wells Fargo" },
                  ].map((pref) => (
                    <div key={pref.label} className="bg-stone-50 border border-stone-100 rounded-lg px-2.5 py-1.5">
                      <div className="text-[8px] text-stone-400 uppercase tracking-wider">{pref.label}</div>
                      <div className="text-[10px] text-stone-800 font-medium">{pref.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SCAN ───────────────────────────────── */}
          <div className={`absolute inset-0 p-5 sm:p-8 transition-all duration-500 ${
            stageId === "scan" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${scanCount < 2847 ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="text-sm font-semibold text-stone-800">
                    {scanCount < 2847 ? "Scanning job boards..." : "Scan complete"}
                  </span>
                </div>
                <div className="text-sm font-bold text-stone-800 tabular-nums">
                  {scanCount.toLocaleString()} <span className="text-stone-400 font-normal text-xs">scanned</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 rounded-full bg-stone-100 mb-5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${scanCount >= 2847 ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min((scanCount / 2847) * 100, 100)}%` }}
                />
              </div>

              {/* Two columns: job stream + matches */}
              <div className="flex gap-4 flex-1 min-h-0">
                {/* Left: streaming jobs */}
                <div className="flex-1 overflow-hidden relative">
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider mb-2">Evaluating</div>
                  <div className="space-y-1.5 relative">
                    {SCAN_JOBS.slice(Math.max(0, scanJobIndex - 2), scanJobIndex + 1).map((job, i, arr) => {
                      const isLatest = i === arr.length - 1;
                      return (
                        <div
                          key={`${job.title}-${job.company}`}
                          className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs transition-all duration-300 ${
                            isLatest ? "bg-stone-50 border border-stone-100" : "opacity-40"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium truncate ${isLatest ? "text-stone-800" : "text-stone-400"}`}>
                              {job.title}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">{job.company}</div>
                          </div>
                          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            job.pass
                              ? "text-stone-400 bg-stone-100"
                              : "text-emerald-700 bg-emerald-50"
                          }`}>
                            {job.fit}%
                          </div>
                          {job.pass && isLatest && (
                            <span className="text-[9px] text-stone-400">skip</span>
                          )}
                          {!job.pass && isLatest && (
                            <span className="text-[9px] text-emerald-600 font-semibold">match!</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: matches found */}
                <div className="w-[180px] sm:w-[200px] flex-shrink-0">
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider mb-2">
                    Matches <span className="text-indigo-600">{matches.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matches.map((m) => (
                      <div
                        key={m.company}
                        className="flex items-center gap-2 py-2 px-2.5 rounded-lg bg-indigo-50 border border-indigo-100 animate-fade-up"
                      >
                        <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">
                          A
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-stone-800 truncate">{m.title}</div>
                          <div className="text-[9px] text-stone-500 truncate">{m.company}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {matches.length === 0 && (
                    <div className="text-[10px] text-stone-300 italic mt-4 text-center">Waiting for matches...</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── OUTREACH ───────────────────────────── */}
          <div className={`absolute inset-0 p-5 sm:p-8 transition-all duration-500 ${
            stageId === "outreach" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col">
              <div className="border border-stone-200 rounded-xl bg-white mb-3 flex-1">
                <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50 rounded-t-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-stone-400 w-6">To</span>
                    <span className="text-xs text-stone-800 font-medium">{MOCK_OUTREACH.to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 w-6">Re</span>
                    <span className="text-xs text-stone-500">{MOCK_OUTREACH.subject}</span>
                  </div>
                </div>

                <div className="px-4 py-4">
                  {MOCK_OUTREACH.lines.map((line, i) => (
                    <div
                      key={i}
                      className={`text-xs leading-relaxed transition-all duration-300 ${
                        i < outreachLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      } ${line === "" ? "h-3" : "text-stone-600"}`}
                    >
                      {line}
                      {i === outreachLines - 1 && outreachLines < MOCK_OUTREACH.lines.length && (
                        <span className="inline-block w-[2px] h-3.5 bg-indigo-500 ml-0.5 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex items-center gap-3 transition-all duration-500 ${
                outreachLines >= MOCK_OUTREACH.lines.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}>
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-700 font-medium">3 personalized messages sent anonymously</span>
              </div>
            </div>
          </div>

          {/* ── NOTIFY ─────────────────────────────── */}
          <div className={`absolute inset-0 p-5 sm:p-8 transition-all duration-500 ${
            stageId === "notify" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col items-center justify-center gap-5">
              <div className={`w-full max-w-[300px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                notifyPhase >= 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
              }`}>
                <div className={`bg-white border border-stone-200 rounded-2xl p-4 transition-all duration-500 ${
                  notifyPhase >= 1 ? "shadow-xl shadow-stone-200/50" : ""
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-900">Quietly</span>
                        <span className="text-[10px] text-stone-400">now</span>
                      </div>
                      <div className="text-xs text-stone-900 font-semibold mb-0.5">
                        Sarah Chen wants to talk
                      </div>
                      <div className="text-[11px] text-stone-500 leading-snug">
                        Hiring Manager at JPMorgan Chase responded to your outreach. Tap to review.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                notifyPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                <button className="px-5 py-2.5 rounded-xl bg-foreground text-white text-xs font-semibold shadow-md">
                  Accept intro
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-xs font-medium">
                  Pass
                </button>
              </div>

              <div className={`transition-all duration-500 ${notifyPhase >= 2 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-xs text-stone-400">Your call. No pressure.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile labels */}
      <div className="sm:hidden mt-4 text-center">
        <div className="text-sm font-semibold text-foreground">{STAGES[activeStage].label}</div>
        <div className="text-xs text-stone-400">{STAGES[activeStage].sublabel}</div>
      </div>
    </div>
  );
}
