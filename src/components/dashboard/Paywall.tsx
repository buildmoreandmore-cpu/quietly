"use client";

import { useState } from "react";
import { useQuietlyStore } from "@/store/quietly";

export default function Paywall() {
  const { subscriptionStatus, userId } = useQuietlyStore();
  const [loading, setLoading] = useState(false);

  // Don't show if subscribed
  if (subscriptionStatus === "active" || subscriptionStatus === "trialing") {
    return null;
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: "" }), // email pulled server-side
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          Activate your account
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Your profile is set up. Subscribe to start nightly job discovery,
          automated outreach, and instant notifications when hiring managers respond.
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-xl text-sm font-medium hover:bg-accent-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          {loading ? "Redirecting..." : "Start for $20/mo"}
        </button>

        <p className="text-[11px] text-stone-400 mt-3">
          Cancel anytime. No contracts.
        </p>
      </div>
    </div>
  );
}
