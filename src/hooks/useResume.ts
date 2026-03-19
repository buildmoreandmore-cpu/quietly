"use client";

import { useCallback, useState } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { createSupabaseBrowser } from "@/lib/supabase";

export function useResume() {
  const { resume, setResume } = useQuietlyStore();
  const [isUploading, setIsUploading] = useState(false);

  const uploadResume = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/resume", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setResume(data.resume);

        // Persist to profile
        try {
          const supabase = createSupabaseBrowser();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("profiles").update({
              resume: data.resume,
              updated_at: new Date().toISOString(),
            }).eq("id", user.id);
          }
        } catch (err) {
          console.error("Failed to persist resume:", err);
        }

        return data.resume;
      } catch (err) {
        console.error("Resume upload error:", err);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [setResume]
  );

  return { resume, uploadResume, isUploading };
}
