"use client";

import { useEffect, useState } from "react";

const NOTIFICATIONS = [
  { name: "Sarah Chen", role: "Engineering Manager", company: "Stripe", score: 92 },
  { name: "James Park", role: "VP Engineering", company: "Linear", score: 88 },
  { name: "Priya Sharma", role: "Head of Product", company: "Vercel", score: 85 },
];

export default function HeroNotification() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const cycle = () => {
      setPhase("in");
      const holdTimer = setTimeout(() => setPhase("hold"), 600);
      const outTimer = setTimeout(() => setPhase("out"), 2800);
      const nextTimer = setTimeout(() => {
        setActive((a) => (a + 1) % NOTIFICATIONS.length);
        cycle();
      }, 3400);
      return [holdTimer, outTimer, nextTimer];
    };

    const timers = cycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  const n = NOTIFICATIONS[active];

  return (
    <div className="relative w-full max-w-[300px]">
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl blur-xl scale-110" />

      <div
        className={`relative bg-white border border-gray-200 rounded-2xl p-4 shadow-xl shadow-accent/5 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          phase === "in" ? "opacity-100 translate-y-0 scale-100" :
          phase === "hold" ? "opacity-100 translate-y-0 scale-100" :
          "opacity-0 -translate-y-3 scale-95"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-900">Quietly</span>
              <span className="text-[10px] text-gray-400">now</span>
            </div>
            <div className="text-xs text-gray-900 font-semibold mb-0.5">
              {n.name} wants to talk
            </div>
            <div className="text-[11px] text-gray-500 leading-snug">
              {n.role} at {n.company} — {n.score}% match
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 text-center py-1.5 rounded-lg bg-gradient-to-r from-accent to-purple-500 text-white text-[10px] font-bold">
            Accept intro
          </div>
          <div className="flex-1 text-center py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-medium">
            Pass
          </div>
        </div>
      </div>
    </div>
  );
}
