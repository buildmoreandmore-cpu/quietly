"use client";

import { useCallback } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { Job, Application, AppStatus } from "@/lib/types";

export function useTracker() {
  const { applications, addApplication, updateApplication, removeApplication } =
    useQuietlyStore();

  const trackJob = useCallback(
    (job: Job) => {
      // Don't add duplicates
      if (applications.some((a) => a.job.id === job.id)) return;

      const app: Application = {
        id: crypto.randomUUID(),
        job,
        status: "saved",
        notes: "",
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addApplication(app);
    },
    [applications, addApplication]
  );

  const updateStatus = useCallback(
    (id: string, status: AppStatus) => {
      updateApplication(id, { status });
    },
    [updateApplication]
  );

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      updateApplication(id, { notes });
    },
    [updateApplication]
  );

  const removeApp = useCallback(
    (id: string) => {
      removeApplication(id);
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
