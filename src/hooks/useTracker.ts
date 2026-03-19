"use client";

import { useCallback } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { Job, Application, AppStatus } from "@/lib/types";
import { createSupabaseBrowser } from "@/lib/supabase";

export function useTracker() {
  const { applications, addApplication, updateApplication, removeApplication } =
    useQuietlyStore();

  const trackJob = useCallback(
    async (job: Job) => {
      if (applications.some((a) => a.job.id === job.id)) return;

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const app: Application = {
        id,
        job,
        status: "saved",
        notes: "",
        appliedAt: now,
        updatedAt: now,
      };
      addApplication(app);

      // Persist to Supabase
      try {
        const supabase = createSupabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("applications").insert({
            id,
            user_id: user.id,
            job,
            status: "saved",
            notes: "",
            applied_at: now,
            updated_at: now,
          });
        }
      } catch (err) {
        console.error("Failed to save application:", err);
      }
    },
    [applications, addApplication]
  );

  const updateStatus = useCallback(
    async (id: string, status: AppStatus) => {
      updateApplication(id, { status });
      try {
        const supabase = createSupabaseBrowser();
        await supabase.from("applications").update({
          status,
          updated_at: new Date().toISOString(),
        }).eq("id", id);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    },
    [updateApplication]
  );

  const updateNotes = useCallback(
    async (id: string, notes: string) => {
      updateApplication(id, { notes });
      try {
        const supabase = createSupabaseBrowser();
        await supabase.from("applications").update({
          notes,
          updated_at: new Date().toISOString(),
        }).eq("id", id);
      } catch (err) {
        console.error("Failed to update notes:", err);
      }
    },
    [updateApplication]
  );

  const removeApp = useCallback(
    async (id: string) => {
      removeApplication(id);
      try {
        const supabase = createSupabaseBrowser();
        await supabase.from("applications").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete application:", err);
      }
    },
    [removeApplication]
  );

  const stats = {
    saved: applications.filter((a) => a.status === "saved").length,
    applied: applications.filter((a) => a.status === "applied").length,
    screening: applications.filter((a) => a.status === "screening").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
  };

  return { applications, trackJob, updateStatus, updateNotes, removeApp, stats };
}
