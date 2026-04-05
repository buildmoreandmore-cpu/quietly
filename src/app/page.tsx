import Link from "next/link";
import ProcessDemo from "@/components/landing/ProcessDemo";

/* ── SVG Icons ─────────────────────────────────────────────── */

function GhostIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 ml-2 inline-block transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

/* ── Feature data ──────────────────────────────────────────── */

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="M12 2a8 8 0 00-8 8v12l3-3 2 2 3-3 3 3 2-2 3 3V10a8 8 0 00-8-8z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Completely invisible",
    desc: "Your name never appears on any job board. No one knows you're looking until you decide they should.",
    gradient: "from-indigo-100 to-purple-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        <path d="M12 2v4" /><path d="M12 18v4" /><path d="M2 12h4" /><path d="M18 12h4" />
      </svg>
    ),
    title: "Scanned nightly",
    desc: "Every night, we scan thousands of live listings. Only roles at 75%+ match reach your dashboard.",
    gradient: "from-blue-100 to-cyan-100",
    iconColor: "text-blue-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
      </svg>
    ),
    title: "Outreach on autopilot",
    desc: "We craft personalized messages to hiring managers. You only engage when someone actually responds.",
    gradient: "from-violet-100 to-fuchsia-100",
    iconColor: "text-violet-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
        <circle cx="18" cy="4" r="3" fill="#6366f1" stroke="none" />
      </svg>
    ),
    title: "Pinged when it matters",
    desc: "The moment a hiring manager responds, you get notified. You decide the next move — no pressure.",
    gradient: "from-rose-100 to-orange-100",
    iconColor: "text-rose-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Precision, not spam",
    desc: "We don't blast 500 applications. One strong outreach beats a hundred generic ones.",
    gradient: "from-emerald-100 to-teal-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Your data, your rules",
    desc: "Block employers. Set a salary floor. Pause anytime. We never share without explicit consent.",
    gradient: "from-amber-100 to-yellow-100",
    iconColor: "text-amber-600",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full animate-fade-in">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-accent to-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-accent/20 group-hover:shadow-accent/30 transition-shadow">
            <GhostIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            <span className="gradient-text">Q</span>uietly
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-muted hover:text-foreground transition-colors font-medium hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="group text-sm bg-accent text-white px-5 py-2.5 rounded-xl hover:bg-accent-dim transition-all font-semibold shadow-md shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5"
          >
            Get started
            <ArrowRightIcon />
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative px-6 pt-20 pb-28 overflow-hidden dot-grid-bg">
          <div className="hero-glow -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-60" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="animate-fade-up inline-flex items-center gap-2 text-xs bg-accent/8 text-accent border border-accent/15 px-4 py-2 rounded-full mb-10 font-semibold">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Autopilot Recruiting Agency
            </div>

            <h1 className="animate-fade-up delay-100 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] text-foreground">
              Stop applying.
              <br />
              <span className="gradient-text">Start getting found.</span>
            </h1>

            <p className="animate-fade-up delay-200 text-lg sm:text-xl text-muted mb-4 max-w-2xl mx-auto leading-relaxed">
              Join the pool. Stay invisible. We find the roles, reach out to
              hiring managers, and only bother you when someone actually
              wants to talk.
            </p>

            <p className="animate-fade-up delay-300 text-sm text-muted/60 mb-12">
              No applications. No employer signups. No marketplace. Just results.
            </p>

            <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="group btn-shimmer bg-gradient-to-r from-accent to-purple-500 text-white px-10 py-4 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-accent/20 transition-all hover:-translate-y-0.5"
              >
                Start for $20/mo
                <ArrowRightIcon />
              </Link>
              <a
                href="#demo"
                className="border border-border text-foreground px-8 py-4 rounded-2xl text-sm font-medium hover:bg-surface hover:border-accent/20 transition-all"
              >
                Watch it work
              </a>
            </div>
          </div>
        </section>

        {/* ── Numbers Strip ────────────────────────────── */}
        <section className="border-y border-border bg-surface/50">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "0", label: "applications you write" },
              { value: "100%", label: "invisible to employers" },
              { value: "75%+", label: "minimum match score" },
              { value: "$20", label: "per month — cancel anytime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live Demo ────────────────────────────────── */}
        <section id="demo" className="px-6 py-28">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4 animate-fade-up">
                Watch how it{" "}
                <span className="gradient-text">actually works</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto text-lg animate-fade-up delay-100">
                This is what happens after you join. Every night. While you sleep.
              </p>
            </div>
            <ProcessDemo />
          </div>
        </section>

        {/* ── Features ─────────────────────────────────── */}
        <section className="px-6 py-28 bg-surface/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">
                Recruiting that runs
                <br />
                <span className="gradient-text">while you sleep</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto text-lg">
                Upload once. We handle discovery, outreach, and follow-up — every single night.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-border rounded-2xl p-7 hover:border-accent/30 hover:shadow-md transition-all group hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-5 ${f.iconColor} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof ─────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-12">
              Built for people who are{" "}
              <span className="gradient-text">too busy to job hunt</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  quote: "I was passively looking for 6 months. Quietly got me 3 intros in my first week.",
                  name: "Senior Engineer",
                  role: "FAANG to Series B startup",
                },
                {
                  quote: "I didn't even have to update my LinkedIn. Just uploaded my resume and forgot about it.",
                  name: "Product Manager",
                  role: "Stealth match in 4 days",
                },
                {
                  quote: "The fact that I'm invisible is everything. My current employer has no idea.",
                  name: "VP of Engineering",
                  role: "Exploring quietly",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-white border border-border rounded-2xl p-6 text-left hover:border-accent/20 hover:shadow-sm transition-all"
                >
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────── */}
        <section className="px-6 py-28 bg-surface/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-foreground">
                Simple pricing.{" "}
                <span className="gradient-text">No surprises.</span>
              </h2>
              <p className="text-muted text-lg max-w-md mx-auto">
                One plan. Everything included. Cancel anytime.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white border-2 border-accent/20 rounded-3xl p-8 shadow-lg shadow-accent/5 hover:shadow-xl hover:shadow-accent/10 transition-all">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs bg-accent/8 text-accent px-3 py-1.5 rounded-full mb-4 font-semibold">
                  Most popular
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-foreground">$20</span>
                  <span className="text-muted text-lg">/mo</span>
                </div>
                <p className="text-sm text-muted">Cancel anytime. No contracts.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Nightly job scanning across all major boards",
                  "Personalized outreach to hiring managers",
                  "Notifications when someone responds",
                  "Block employers, set salary floors",
                  "Full dashboard with match grades",
                  "100% invisible — always",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/signup"
                className="group btn-shimmer block w-full text-center bg-gradient-to-r from-accent to-purple-500 text-white py-4 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5"
              >
                Get started
                <ArrowRightIcon />
              </Link>

              <p className="text-xs text-muted text-center mt-4">
                Set up in 2 minutes. First matches within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────── */}
        <section className="px-6 py-28 relative overflow-hidden dot-grid-bg">
          <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-50" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 text-foreground">
              Your next role is already{" "}
              <span className="gradient-text">out there.</span>
            </h2>
            <p className="text-muted mb-12 max-w-md mx-auto text-lg">
              Let us find it while you focus on what matters.
            </p>
            <Link
              href="/auth/signup"
              className="group btn-shimmer inline-flex items-center bg-gradient-to-r from-accent to-purple-500 text-white px-12 py-4 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-accent/20 transition-all hover:-translate-y-0.5"
            >
              Join Quietly — $20/mo
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-accent to-purple-500 rounded-lg flex items-center justify-center">
              <GhostIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">Quietly</span>
          </div>
          <p className="text-xs text-muted">
            Your career on autopilot. No data shared. Ever.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:text-foreground transition-colors">
              Join
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
