"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useQuietlyStore } from "@/store/quietly";
import type { User } from "@supabase/supabase-js";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    setResume,
    setApplications,
    setShowOnboarding,
    setSalaryFloor,
  } = useQuietlyStore();

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    // Check current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      hydrateProfile(user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/auth/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function hydrateProfile(userId: string) {
    try {
      const supabase = createSupabaseBrowser();

      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        if (profile.resume) {
          setResume(profile.resume);
        }
        if (profile.salary_floor) {
          setSalaryFloor(profile.salary_floor);
        }
        if (profile.blocked_employers?.length) {
          profile.blocked_employers.forEach((emp: string) => {
            useQuietlyStore.getState().addBlockedEmployer(emp);
          });
        }
        setShowOnboarding(!profile.onboarded);
      }

      // Load applications
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("applied_at", { ascending: false });

      if (apps?.length) {
        setApplications(
          apps.map((a) => ({
            id: a.id,
            job: a.job,
            status: a.status,
            notes: a.notes || "",
            appliedAt: a.applied_at,
            updatedAt: a.updated_at,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to hydrate profile:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
