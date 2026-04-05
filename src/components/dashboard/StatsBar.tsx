"use client";

import { useQuietlyStore } from "@/store/quietly";

export default function StatsBar() {
  const { stats } = useQuietlyStore();

  const cards = [
    { label: "Matches Found", value: stats.totalMatches, color: "text-accent" },
    { label: "New", value: stats.newMatches, color: "text-blue-600" },
    { label: "Outreach Sent", value: stats.outreachSent, color: "text-yellow-600" },
    { label: "Responses", value: stats.responses, color: "text-green-600" },
    { label: "Intros Made", value: stats.introsMade, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-border rounded-xl p-4"
        >
          <p className="text-xs text-muted">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color} mt-1`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
