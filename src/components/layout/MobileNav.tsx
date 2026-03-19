"use client";

import { useQuietlyStore } from "@/store/quietly";

export default function MobileNav() {
  const { mobileView, setMobileView, applications } = useQuietlyStore();

  return (
    <div className="md:hidden border-t border-border flex shrink-0 bg-background">
      <button
        onClick={() => setMobileView("chat")}
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex flex-col items-center gap-0.5 ${
          mobileView === "chat"
            ? "text-accent border-t-2 border-accent"
            : "text-muted"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Chat
      </button>
      <button
        onClick={() => setMobileView("tracker")}
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative flex flex-col items-center gap-0.5 ${
          mobileView === "tracker"
            ? "text-accent border-t-2 border-accent"
            : "text-muted"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        Tracker
        {applications.length > 0 && (
          <span className="absolute top-1.5 right-1/4 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
            {applications.length}
          </span>
        )}
      </button>
    </div>
  );
}
