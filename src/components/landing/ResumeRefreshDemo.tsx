"use client";

import { useState, useEffect, useRef } from "react";

/* ── Data ──────────────────────────────────────────────────── */

const BEFORE_BULLETS = [
  "Spearheaded the transformation of the entire client onboarding process resulting in dramatically improved outcomes",
  "Leveraged cutting-edge data analytics tools to drive strategic decision-making across the organization",
  "Instrumental in orchestrating a cross-functional initiative that revolutionized team productivity",
];

const CLAUDE_REWRITES = [
  "Rebuilt the client onboarding flow from a 12-step paper form to a 3-screen digital process",
  "Built dashboards in Looker that the sales team used to prioritize outreach by deal size",
  "Coordinated a 4-person team to migrate the support wiki from Confluence to Notion in 6 weeks",
];

// An example where GPT catches something
const INFLATED_REWRITE =
  "Pioneered a groundbreaking dashboard solution that transformed organizational decision-making";
const GPT_CORRECTION =
  "Built dashboards in Looker that the sales team used to prioritize outreach by deal size";
const GPT_FLAG_TEXT = "\"Pioneered\" and \"groundbreaking\" are not in the original. \"Transformed\" inflates scope.";

/* ── Phases ────────────────────────────────────────────────── */
// 1. Show original bullets (weak language)
// 2. Claude rewrites them one by one (scan + replace)
// 3. GPT review pass — catches one inflation, corrects it
// 4. Final clean state — hold, then loop

const PHASE_DURATIONS = [2500, 5000, 4000, 3000];

export default function ResumeRefreshDemo() {
  const [phase, setPhase] = useState(0);
  const [activeBullet, setActiveBullet] = useState(-1);
  const [rewrittenBullets, setRewrittenBullets] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [showGptScan, setShowGptScan] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [allClean, setAllClean] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setPhase(0);
    setActiveBullet(-1);
    setRewrittenBullets([null, null, null]);
    setShowGptScan(false);
    setShowFlag(false);
    setShowCorrection(false);
    setAllClean(false);
  };

  useEffect(() => {
    if (isPaused) return;

    if (phase === 0) {
      // Show originals, then advance
      timerRef.current = setTimeout(() => setPhase(1), PHASE_DURATIONS[0]);
    }

    if (phase === 1) {
      // Claude rewrites one at a time
      const rewriteSequence = async () => {
        for (let i = 0; i < 3; i++) {
          if (isPaused) return;
          setActiveBullet(i);
          await new Promise((r) => {
            timerRef.current = setTimeout(r, 600);
          });
          // Show rewrite — but bullet[1] gets the inflated version first
          setRewrittenBullets((prev) => {
            const next = [...prev];
            next[i] = i === 1 ? INFLATED_REWRITE : CLAUDE_REWRITES[i];
            return next;
          });
          await new Promise((r) => {
            timerRef.current = setTimeout(r, 1000);
          });
        }
        setActiveBullet(-1);
        setPhase(2);
      };
      rewriteSequence();
    }

    if (phase === 2) {
      // GPT review scan
      setShowGptScan(true);
      timerRef.current = setTimeout(() => {
        setShowFlag(true);
        setTimeout(() => {
          setShowCorrection(true);
          setRewrittenBullets((prev) => {
            const next = [...prev];
            next[1] = GPT_CORRECTION;
            return next;
          });
          setTimeout(() => {
            setShowFlag(false);
            setShowGptScan(false);
            setPhase(3);
          }, 1500);
        }, 1500);
      }, 1000);
    }

    if (phase === 3) {
      setAllClean(true);
      timerRef.current = setTimeout(() => {
        reset();
      }, PHASE_DURATIONS[3]);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPaused]);

  return (
    <div
      className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
          </div>
          <span className="text-[11px] text-stone-400 font-medium">
            Resume Refresher
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Phase indicators */}
          <PhaseIndicator label="Claude" active={phase === 1} done={phase > 1} color="indigo" />
          <PhaseIndicator label="GPT Review" active={phase === 2} done={phase > 2} color="amber" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-stone-500">Experience &mdash; Operations Analyst, Deloitte</span>
        </div>

        {/* Bullets */}
        {[0, 1, 2].map((i) => {
          const isActive = activeBullet === i;
          const rewritten = rewrittenBullets[i];
          const isInflated = phase === 2 && showFlag && i === 1 && !showCorrection;

          return (
            <div
              key={i}
              className={`relative rounded-lg transition-all duration-500 ${
                isActive
                  ? "bg-indigo-50/60 border border-indigo-200/60"
                  : isInflated
                    ? "bg-amber-50/60 border border-amber-200/60"
                    : allClean
                      ? "bg-green-50/40 border border-green-200/40"
                      : "bg-stone-50/60 border border-stone-100"
              } px-4 py-3`}
            >
              {/* Scan line */}
              {isActive && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <div className="absolute inset-x-0 h-[2px] bg-indigo-400/40 animate-scan-down" />
                </div>
              )}

              {/* GPT flag icon */}
              {isInflated && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center animate-fade-in shadow-sm">
                  <span className="text-[10px] text-white font-bold">!</span>
                </div>
              )}

              {/* Text */}
              <div className="flex items-start gap-2">
                <span className="text-stone-300 text-xs mt-0.5">&bull;</span>
                <div className="flex-1 min-w-0">
                  {/* Original (shown when no rewrite yet) */}
                  {!rewritten && (
                    <p className="text-sm text-stone-500 leading-relaxed">
                      {BEFORE_BULLETS[i]}
                    </p>
                  )}

                  {/* Rewritten */}
                  {rewritten && !isInflated && (
                    <p className="text-sm text-foreground leading-relaxed animate-fade-in">
                      {rewritten}
                    </p>
                  )}

                  {/* Inflated version with flag */}
                  {isInflated && (
                    <div className="space-y-1.5">
                      <p className="text-sm text-amber-700 leading-relaxed line-through decoration-amber-400/60">
                        {INFLATED_REWRITE}
                      </p>
                      <p className="text-[10px] text-amber-600 font-medium">
                        {GPT_FLAG_TEXT}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* GPT scanning bar */}
        {showGptScan && !allClean && (
          <div className="flex items-center gap-2 pt-2 animate-fade-in">
            <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-[11px] text-amber-600 font-medium">
              {showFlag ? "Inflation detected — correcting..." : "GPT-4o reviewing for honesty..."}
            </span>
          </div>
        )}

        {/* All clean badge */}
        {allClean && (
          <div className="flex items-center gap-2 pt-2 animate-fade-in">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[11px] text-green-600 font-medium">
              Clean, honest, and clear. No inflation.
            </span>
          </div>
        )}
      </div>

      {/* Hover hint */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10 pointer-events-none">
          <span className="text-xs text-stone-400 font-medium bg-white/80 px-3 py-1.5 rounded-full border border-stone-200">
            Paused — move cursor away to resume
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Phase indicator pill ─────────────────────────────────── */

function PhaseIndicator({
  label,
  active,
  done,
  color,
}: {
  label: string;
  active: boolean;
  done: boolean;
  color: "indigo" | "amber";
}) {
  const bg = done
    ? color === "indigo"
      ? "bg-indigo-100 text-indigo-600"
      : "bg-amber-100 text-amber-600"
    : active
      ? color === "indigo"
        ? "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
        : "bg-amber-50 text-amber-500 ring-1 ring-amber-200"
      : "bg-stone-100 text-stone-400";

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${bg}`}>
      {done ? "\u2713 " : ""}
      {label}
    </span>
  );
}
