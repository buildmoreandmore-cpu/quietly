"use client";

import { useState } from "react";
import { useQuietlyStore } from "@/store/quietly";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import StatsBar from "./StatsBar";
import MatchList from "./MatchList";
import ProfileCard from "./ProfileCard";
import ResumeEditor from "./ResumeEditor";
import { ParsedResume } from "@/lib/types";
import { createSupabaseBrowser } from "@/lib/supabase";

export default function Dashboard() {
  const { fullName, resume, setResume } = useQuietlyStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSaveResume = async (updated: ParsedResume) => {
    setResume(updated);
    try {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          resume: updated,
          updated_at: new Date().toISOString(),
        }).eq("id", user.id);
      }
    } catch (err) {
      console.error("Failed to save resume:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-accent">Q</span>uietly
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">
              {fullName || "Candidate"}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-muted text-sm mt-1">
            Here&apos;s what we&apos;ve been working on for you.
          </p>
        </div>

        <StatsBar />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MatchList />
          </div>
          <div>
            <ProfileCard onEditResume={() => setEditorOpen(true)} />
          </div>
        </div>
      </main>

      {/* Resume Editor slide-over */}
      {editorOpen && resume && (
        <ResumeEditor
          resume={resume}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveResume}
        />
      )}
    </div>
  );
}
