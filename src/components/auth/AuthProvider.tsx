"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useQuietlyStore } from "@/store/quietly";
import type { User } from "@supabase/supabase-js";
import type { Match, OutreachEntry } from "@/lib/types";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    setUserId,
    setFullName,
    setResume,
    setTargetTitles,
    setTargetLocations,
    setBlockedEmployers,
    setSalaryFloor,
    setJobType,
    setIsActive,
    setShowOnboarding,
    setMatches,
    setOutreach,
    setStats,
    setSubscriptionStatus,
    setStripeCustomerId,
  } = useQuietlyStore();

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      hydrateProfile(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
      }
    });

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
        setUserId(userId);
        setFullName(profile.full_name || "");
        if (profile.resume) setResume(profile.resume);
        if (profile.target_titles?.length) setTargetTitles(profile.target_titles);
        if (profile.target_locations?.length) setTargetLocations(profile.target_locations);
        if (profile.blocked_employers?.length) setBlockedEmployers(profile.blocked_employers);
        if (profile.salary_floor) setSalaryFloor(profile.salary_floor);
        if (profile.job_type) setJobType(profile.job_type);
        setIsActive(profile.is_active ?? true);
        setShowOnboarding(!profile.onboarded);
        setSubscriptionStatus(profile.subscription_status || "none");
        if (profile.stripe_customer_id) setStripeCustomerId(profile.stripe_customer_id);
      }

      // Load matches
      const { data: matchRows } = await supabase
        .from("matches")
        .select("*")
        .eq("user_id", userId)
        .order("discovered_at", { ascending: false });

      if (matchRows?.length) {
        const matches: Match[] = matchRows.map((m) => ({
          id: m.id,
          userId: m.user_id,
          title: m.title,
          company: m.company,
          location: m.location || "",
          jobType: m.job_type || "",
          salaryRange: m.salary_range || "",
          url: m.url || "",
          postedDate: m.posted_date || "",
          matchScore: m.match_score,
          matchGrade: m.match_grade,
          whyItFits: m.why_it_fits || "",
          oneConcern: m.one_concern || "",
          source: m.source || "",
          status: m.status,
          discoveredAt: m.discovered_at,
        }));
        setMatches(matches);

        // Compute stats
        const newMatches = matches.filter((m) => m.status === "new").length;
        const outreachSent = matches.filter((m) => m.status === "outreach_sent").length;
        const responses = matches.filter((m) => m.status === "responded").length;
        const introsMade = matches.filter((m) => m.status === "intro_made").length;
        setStats({
          totalMatches: matches.length,
          newMatches,
          outreachSent,
          responses,
          introsMade,
        });
      }

      // Load outreach log
      const { data: outreachRows } = await supabase
        .from("outreach_log")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (outreachRows?.length) {
        const entries: OutreachEntry[] = outreachRows.map((o) => ({
          id: o.id,
          matchId: o.match_id,
          userId: o.user_id,
          hiringManager: o.hiring_manager || "",
          channel: o.channel,
          variant: o.variant,
          subject: o.subject || "",
          messageBody: o.message_body,
          sentAt: o.sent_at,
          respondedAt: o.responded_at,
          responseSummary: o.response_summary,
          status: o.status,
          createdAt: o.created_at,
        }));
        setOutreach(entries);
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
          <svg
            className="w-8 h-8 text-accent animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
