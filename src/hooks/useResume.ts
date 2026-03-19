"use client";

import { useCallback, useState } from "react";
import { useQuietlyStore } from "@/store/quietly";

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

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        setResume(data.resume);
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
