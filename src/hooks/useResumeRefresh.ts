"use client";

import { useState } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { createSupabaseBrowser } from "@/lib/supabase";
import { ParsedResume, RefreshResult } from "@/lib/types";

export function useResumeRefresh() {
  const { setResume } = useQuietlyStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<RefreshResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<
    "idle" | "rewriting" | "reviewing" | "done"
  >("idle");

  const refreshResume = async (editedResume: ParsedResume) => {
    setIsRefreshing(true);
    setError(null);
    setStage("rewriting");

    try {
      // Brief delay then switch to reviewing stage (approximate — actual pipeline is server-side)
      const stageTimer = setTimeout(() => setStage("reviewing"), 4000);

      const res = await fetch("/api/resume/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: editedResume }),
      });

      clearTimeout(stageTimer);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Refresh failed");
      }

      const result: RefreshResult = await res.json();
      setRefreshResult(result);
      setStage("done");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Refresh failed";
      setError(message);
      setStage("idle");
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  };

  const acceptRefresh = async (finalResume: ParsedResume) => {
    setResume(finalResume);

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
            resume: finalResume,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("Failed to persist refreshed resume:", err);
    }

    setRefreshResult(null);
    setStage("idle");
  };

  const discardRefresh = () => {
    setRefreshResult(null);
    setStage("idle");
  };

  return {
    isRefreshing,
    refreshResult,
    error,
    stage,
    refreshResume,
    acceptRefresh,
    discardRefresh,
  };
}
