"use client";

const ROLES = [
  "Senior Frontend Engineer",
  "Staff Product Engineer",
  "VP of Engineering",
  "Principal Backend Engineer",
  "Head of Product",
  "Engineering Manager",
  "Senior Full-Stack Developer",
  "Staff Software Engineer",
  "Director of Engineering",
  "Senior DevOps Engineer",
  "Lead Mobile Engineer",
  "Principal Architect",
];

export default function Ticker() {
  // Double the array for seamless loop
  const items = [...ROLES, ...ROLES];

  return (
    <div className="relative overflow-hidden py-5 border-y border-stone-200/60">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex gap-6 animate-marquee">
        {items.map((role, i) => (
          <div
            key={`${role}-${i}`}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <span className="text-sm text-stone-400 whitespace-nowrap">{role}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
