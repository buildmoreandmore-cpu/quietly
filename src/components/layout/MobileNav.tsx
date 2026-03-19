"use client";

import { useQuietlyStore } from "@/store/quietly";

export default function MobileNav() {
  const { mobileView, setMobileView, applications } = useQuietlyStore();

  return (
    <div className="md:hidden border-t border-border flex shrink-0">
      <button
        onClick={() => setMobileView("chat")}
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
          mobileView === "chat"
            ? "text-accent border-t-2 border-accent"
            : "text-muted"
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => setMobileView("tracker")}
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${
          mobileView === "tracker"
            ? "text-accent border-t-2 border-accent"
            : "text-muted"
        }`}
      >
        Tracker
        {applications.length > 0 && (
          <span className="absolute top-2 right-1/4 bg-accent text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {applications.length}
          </span>
        )}
      </button>
    </div>
  );
}
