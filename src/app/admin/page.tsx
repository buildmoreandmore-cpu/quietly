"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  onboarded: boolean;
  isActive: boolean;
  hasResume: boolean;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  targetTitles: string[];
  targetLocations: string[];
  salaryFloor: number;
  jobType: string;
  lastDiscoveryAt: string | null;
  createdAt: string;
  totalMatches: number;
  outreachSent: number;
  responses: number;
}

interface Overview {
  totalUsers: number;
  onboarded: number;
  withResume: number;
  activeSubscribers: number;
  totalMatches: number;
  totalOutreach: number;
  totalResponses: number;
  mrr: number;
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "subscribed" | "no-resume">("all");
  const [credentials, setCredentials] = useState("");

  const fetchData = async (creds?: string) => {
    const auth = creds || credentials;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data.users);
      setOverview(data.overview);
      setAuthed(true);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const encoded = btoa(`${username}:${password}`);
    setCredentials(encoded);
    fetchData(encoded);
  };

  // Auto-refresh every 30s
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const filteredUsers = users.filter((u) => {
    if (filter === "active") return u.isActive;
    if (filter === "subscribed") return u.subscriptionStatus === "active" || u.subscriptionStatus === "trialing";
    if (filter === "no-resume") return !u.hasResume;
    return true;
  });

  const timeAgo = (date: string | null) => {
    if (!date) return "Never";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Admin</h1>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
          <div className="space-y-3">
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 text-foreground"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-foreground text-white py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              <span className="text-accent">Q</span>uietly
            </Link>
            <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <button
            onClick={() => fetchData()}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Overview cards */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={overview.totalUsers} />
            <StatCard label="Subscribers" value={overview.activeSubscribers} accent />
            <StatCard label="MRR" value={`$${overview.mrr}`} accent />
            <StatCard label="Onboarded" value={`${overview.onboarded}/${overview.totalUsers}`} />
            <StatCard label="With Resume" value={overview.withResume} />
            <StatCard label="Total Matches" value={overview.totalMatches} />
            <StatCard label="Outreach Sent" value={overview.totalOutreach} />
            <StatCard label="Responses" value={overview.totalResponses} accent />
          </div>
        )}

        {/* Pipeline funnel */}
        {overview && overview.totalUsers > 0 && (
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Conversion funnel</h2>
            <div className="space-y-2">
              <FunnelBar label="Signed up" value={overview.totalUsers} max={overview.totalUsers} />
              <FunnelBar label="Onboarded" value={overview.onboarded} max={overview.totalUsers} />
              <FunnelBar label="Uploaded resume" value={overview.withResume} max={overview.totalUsers} />
              <FunnelBar label="Subscribed" value={overview.activeSubscribers} max={overview.totalUsers} />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "active", "subscribed", "no-resume"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                filter === f
                  ? "bg-foreground text-white"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "active" ? "Active" : f === "subscribed" ? "Subscribed" : "No resume"}
            </button>
          ))}
          <span className="text-xs text-muted ml-auto">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* User table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">User</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Sub</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Resume</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Matches</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Outreach</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Responses</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Last scan</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <>
                    <tr
                      key={user.id}
                      onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      className="border-b border-border/50 hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{user.fullName || "—"}</p>
                        <p className="text-[10px] text-muted">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge active={user.isActive} onboarded={user.onboarded} />
                      </td>
                      <td className="px-4 py-3">
                        <SubBadge status={user.subscriptionStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${user.hasResume ? "text-green-600" : "text-stone-400"}`}>
                          {user.hasResume ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{user.totalMatches}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{user.outreachSent}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${user.responses > 0 ? "text-green-600 font-medium" : "text-muted"}`}>
                          {user.responses}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">{timeAgo(user.lastDiscoveryAt)}</td>
                      <td className="px-4 py-3 text-xs text-muted">{timeAgo(user.createdAt)}</td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedUser === user.id && (
                      <tr key={`${user.id}-detail`}>
                        <td colSpan={9} className="px-4 py-4 bg-background border-b border-border">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Looking for</p>
                              <p className="text-foreground">{user.targetTitles.join(", ") || "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Locations</p>
                              <p className="text-foreground">{user.targetLocations.join(", ") || "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Salary floor</p>
                              <p className="text-foreground">{user.salaryFloor ? `$${user.salaryFloor.toLocaleString()}` : "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Job type</p>
                              <p className="text-foreground capitalize">{user.jobType || "Not set"}</p>
                            </div>
                            {user.stripeCustomerId && (
                              <div>
                                <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Stripe ID</p>
                                <p className="text-foreground font-mono text-[10px]">{user.stripeCustomerId}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">User ID</p>
                              <p className="text-foreground font-mono text-[10px]">{user.id}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-muted text-sm">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3">
      <p className="text-[10px] text-muted uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-border/50 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-foreground font-medium w-12 text-right">
        {value} ({Math.round(pct)}%)
      </span>
    </div>
  );
}

function StatusBadge({ active, onboarded }: { active: boolean; onboarded: boolean }) {
  if (!onboarded) {
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Not onboarded</span>;
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
      active ? "bg-green-50 text-green-600" : "bg-stone-100 text-stone-500"
    }`}>
      {active ? "Active" : "Paused"}
    </span>
  );
}

function SubBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-accent/10 text-accent",
    trialing: "bg-blue-50 text-blue-600",
    past_due: "bg-amber-50 text-amber-600",
    canceled: "bg-red-50 text-red-500",
    none: "bg-stone-100 text-stone-400",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${styles[status] || styles.none}`}>
      {status === "none" ? "Free" : status.replace("_", " ")}
    </span>
  );
}
