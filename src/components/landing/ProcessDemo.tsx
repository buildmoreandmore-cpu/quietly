"use client";

import { useEffect, useState, useCallback } from "react";

/* ── Stage config ──────────────────────────────────────────── */

const STAGES = [
  {
    id: "upload",
    label: "You join the pool",
    sublabel: "2 minutes. That's it.",
    duration: 3000,
  },
  {
    id: "scan",
    label: "We scan while you sleep",
    sublabel: "Every night. Thousands of roles.",
    duration: 4000,
  },
  {
    id: "outreach",
    label: "Outreach goes out",
    sublabel: "Personalized. Anonymous.",
    duration: 4000,
  },
  {
    id: "notify",
    label: "You get pinged",
    sublabel: "Only when it matters.",
    duration: 3500,
  },
] as const;

type StageId = (typeof STAGES)[number]["id"];

/* ── Mock data ─────────────────────────────────────────────── */

const MOCK_MATCHES = [
  { company: "Stripe", title: "Senior Frontend Engineer", score: 92, grade: "A" },
  { company: "Linear", title: "Staff Product Engineer", score: 88, grade: "A" },
  { company: "Vercel", title: "Senior Full-Stack Engineer", score: 81, grade: "B" },
];

const MOCK_SKILLS = ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"];

const MOCK_OUTREACH = {
  to: "Sarah Chen — Engineering Manager, Stripe",
  subject: "Exceptional full-stack candidate — 92% match",
  lines: [
    "Hi Sarah,",
    "",
    "I'm reaching out on behalf of a senior engineer whose",
    "background is a strong fit for your open role.",
    "",
    "They bring 6+ years of React/TypeScript experience,",
    "deep PostgreSQL knowledge, and a track record of",
    "shipping high-impact product features at scale.",
    "",
    "Would you be open to a confidential introduction?",
  ],
};

/* ── Component ─────────────────────────────────────────────── */

export default function ProcessDemo() {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [uploadPhase, setUploadPhase] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [matchesRevealed, setMatchesRevealed] = useState(0);
  const [outreachLines, setOutreachLines] = useState(0);
  const [notifyPhase, setNotifyPhase] = useState(0);

  const resetSubAnimations = useCallback(() => {
    setUploadPhase(0);
    setScanCount(0);
    setMatchesRevealed(0);
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

  // Sub-animations per stage
  useEffect(() => {
    if (isPaused) return;
    const stageId = STAGES[activeStage].id;

    if (stageId === "upload") {
      const t1 = setTimeout(() => setUploadPhase(1), 600);
      const t2 = setTimeout(() => setUploadPhase(2), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    if (stageId === "scan") {
      let count = 0;
      const iv = setInterval(() => {
        count += Math.floor(Math.random() * 80) + 40;
        if (count > 2847) count = 2847;
        setScanCount(count);
        if (count >= 2847) clearInterval(iv);
      }, 100);
      const t1 = setTimeout(() => setMatchesRevealed(1), 2000);
      const t2 = setTimeout(() => setMatchesRevealed(2), 2400);
      const t3 = setTimeout(() => setMatchesRevealed(3), 2800);
      return () => { clearInterval(iv); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    if (stageId === "outreach") {
      let line = 0;
      const iv = setInterval(() => {
        line++;
        setOutreachLines(line);
        if (line >= MOCK_OUTREACH.lines.length) clearInterval(iv);
      }, 250);
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
            onClick={() => {
              resetSubAnimations();
              setActiveStage(i);
              setProgress(0);
            }}
            className={`flex-1 text-left group transition-all duration-300 ${
              i === activeStage ? "opacity-100" : "opacity-40 hover:opacity-60"
            }`}
          >
            <div className="h-1 rounded-full bg-foreground/10 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-100 ease-linear"
                style={{
                  width: i < activeStage ? "100%" : i === activeStage ? `${progress}%` : "0%",
                }}
              />
            </div>
            <div className="text-xs font-bold text-foreground mb-0.5 hidden sm:block">
              {stage.label}
            </div>
            <div className="text-[10px] text-muted hidden sm:block">
              {stage.sublabel}
            </div>
          </button>
        ))}
      </div>

      {/* ── Demo screen (dark inset) ───────────────── */}
      <div className="relative demo-screen border border-gray-200/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a10]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-[10px] text-white/30 bg-white/5 px-3 py-0.5 rounded-md">
              quietly.app
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
          {/* ── Stage: Upload ──────────────────────── */}
          <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 ${
            stageId === "upload" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className={`w-full max-w-sm border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-700 ${
                uploadPhase === 0 ? "border-indigo-400/30 bg-indigo-500/5" :
                uploadPhase === 1 ? "border-indigo-400/60 bg-indigo-500/10 scale-[0.98]" :
                "border-emerald-400/60 bg-emerald-500/10"
              }`}>
                {uploadPhase < 2 ? (
                  <>
                    <div className={`mx-auto w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 transition-all duration-500 ${uploadPhase === 1 ? "animate-pulse" : "animate-bounce"}`}>
                      <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">
                      {uploadPhase === 0 ? "resume_2024.pdf" : "Parsing resume..."}
                    </div>
                    <div className="text-xs text-white/50">
                      {uploadPhase === 0 ? "Dropping file..." : "Extracting skills, experience, preferences"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">Profile built</div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {MOCK_SKILLS.map((skill, i) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/20 animate-fade-up"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className={`w-full max-w-sm grid grid-cols-2 gap-2 transition-all duration-500 ${uploadPhase === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {[
                  { label: "Target", value: "Sr. Frontend, Staff Eng" },
                  { label: "Location", value: "Remote / NYC" },
                  { label: "Floor", value: "$180k+" },
                  { label: "Blocked", value: "Meta, Oracle" },
                ].map((pref) => (
                  <div key={pref.label} className="bg-white/5 rounded-lg px-3 py-2">
                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">{pref.label}</div>
                    <div className="text-xs text-white font-medium">{pref.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stage: Scan ────────────────────────── */}
          <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 ${
            stageId === "scan" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <svg className={`w-4 h-4 text-indigo-400 ${scanCount < 2847 ? "animate-spin" : ""}`} style={{ animationDuration: "2s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Nightly scan running</div>
                    <div className="text-[10px] text-white/40">2:00 AM EST — while you sleep</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-indigo-400 tabular-nums">{scanCount.toLocaleString()}</div>
                  <div className="text-[10px] text-white/40">jobs scanned</div>
                </div>
              </div>

              <div className="h-1 rounded-full bg-white/5 mb-6 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${Math.min((scanCount / 2847) * 100, 100)}%` }}
                />
              </div>

              <div className="flex-1 space-y-2">
                {MOCK_MATCHES.map((match, i) => (
                  <div
                    key={match.company}
                    className={`flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 transition-all duration-500 ${
                      i < matchesRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                      match.grade === "A" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {match.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{match.title}</div>
                      <div className="text-xs text-white/50">{match.company}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-indigo-400">{match.score}%</div>
                      <div className="text-[10px] text-white/40">match</div>
                    </div>
                  </div>
                ))}

                <div className={`text-center pt-2 transition-all duration-500 ${matchesRevealed >= 3 ? "opacity-100" : "opacity-0"}`}>
                  <span className="text-xs text-white/50">
                    <span className="text-indigo-400 font-bold">3 matches</span> found from 2,847 listings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stage: Outreach ────────────────────── */}
          <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 ${
            stageId === "outreach" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col">
              <div className="border border-white/[0.06] rounded-xl bg-white/[0.02] mb-3">
                <div className="px-4 py-2.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-white/40 w-8">To:</span>
                    <span className="text-xs text-white font-medium">{MOCK_OUTREACH.to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 w-8">Re:</span>
                    <span className="text-xs text-white/80">{MOCK_OUTREACH.subject}</span>
                  </div>
                </div>

                <div className="px-4 py-3 min-h-[200px]">
                  {MOCK_OUTREACH.lines.map((line, i) => (
                    <div
                      key={i}
                      className={`text-xs leading-relaxed transition-all duration-300 ${
                        i < outreachLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      } ${line === "" ? "h-3" : "text-white/80"}`}
                    >
                      {line}
                      {i === outreachLines - 1 && outreachLines < MOCK_OUTREACH.lines.length && (
                        <span className="inline-block w-[2px] h-3 bg-indigo-400 ml-0.5 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex items-center gap-3 transition-all duration-500 ${
                outreachLines >= MOCK_OUTREACH.lines.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-400">Outreach sent</div>
                  <div className="text-[10px] text-white/40">3 personalized messages delivered anonymously</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stage: Notify ──────────────────────── */}
          <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 ${
            stageId === "notify" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <div className={`w-full max-w-[280px] transition-all duration-700 ${
                notifyPhase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}>
                <div className={`bg-white/[0.06] border border-white/[0.1] rounded-2xl p-4 backdrop-blur-sm transition-all duration-500 ${
                  notifyPhase >= 1 ? "shadow-lg shadow-indigo-500/20" : ""
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">Quietly</span>
                        <span className="text-[10px] text-white/40">now</span>
                      </div>
                      <div className="text-xs text-white/90 font-medium mb-0.5">
                        Sarah Chen wants to talk
                      </div>
                      <div className="text-[11px] text-white/50 leading-snug">
                        Engineering Manager at Stripe responded to your outreach. Tap to review the intro.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex gap-3 transition-all duration-500 ${
                notifyPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
                  Accept intro
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/70 text-xs font-medium">
                  Pass
                </button>
              </div>

              <div className={`text-center transition-all duration-500 ${
                notifyPhase >= 2 ? "opacity-100" : "opacity-0"
              }`}>
                <div className="text-xs text-white/40">
                  Your call. No pressure. No deadlines.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile stage labels */}
      <div className="sm:hidden mt-4 text-center">
        <div className="text-sm font-bold text-foreground">{STAGES[activeStage].label}</div>
        <div className="text-xs text-muted">{STAGES[activeStage].sublabel}</div>
      </div>
    </div>
  );
}
