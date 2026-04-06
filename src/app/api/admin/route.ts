import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// GET /api/admin — fetch all users + stats
// Protected by admin secret
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();

  // Fetch all profiles
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profileErr) {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }

  // Fetch match counts per user
  const { data: matchCounts } = await supabase
    .from("matches")
    .select("user_id, status");

  // Fetch outreach counts per user
  const { data: outreachCounts } = await supabase
    .from("outreach_log")
    .select("user_id, status");

  // Aggregate stats per user
  const userStats = new Map<string, {
    totalMatches: number;
    outreachSent: number;
    responses: number;
  }>();

  for (const m of matchCounts || []) {
    const existing = userStats.get(m.user_id) || { totalMatches: 0, outreachSent: 0, responses: 0 };
    existing.totalMatches++;
    if (m.status === "responded") existing.responses++;
    userStats.set(m.user_id, existing);
  }

  for (const o of outreachCounts || []) {
    const existing = userStats.get(o.user_id) || { totalMatches: 0, outreachSent: 0, responses: 0 };
    if (o.status === "sent" || o.status === "responded") existing.outreachSent++;
    userStats.set(o.user_id, existing);
  }

  // Build user list
  const users = (profiles || []).map((p) => {
    const stats = userStats.get(p.id) || { totalMatches: 0, outreachSent: 0, responses: 0 };
    return {
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      onboarded: p.onboarded,
      isActive: p.is_active,
      hasResume: !!p.resume,
      subscriptionStatus: p.subscription_status || "none",
      stripeCustomerId: p.stripe_customer_id,
      targetTitles: p.target_titles || [],
      targetLocations: p.target_locations || [],
      salaryFloor: p.salary_floor || 0,
      jobType: p.job_type,
      lastDiscoveryAt: p.last_discovery_at,
      createdAt: p.created_at,
      ...stats,
    };
  });

  // Platform-level stats
  const overview = {
    totalUsers: users.length,
    onboarded: users.filter((u) => u.onboarded).length,
    withResume: users.filter((u) => u.hasResume).length,
    activeSubscribers: users.filter((u) => u.subscriptionStatus === "active" || u.subscriptionStatus === "trialing").length,
    totalMatches: matchCounts?.length || 0,
    totalOutreach: outreachCounts?.length || 0,
    totalResponses: (matchCounts || []).filter((m) => m.status === "responded").length,
    mrr: users.filter((u) => u.subscriptionStatus === "active").length * 20,
  };

  return NextResponse.json({ users, overview });
}
