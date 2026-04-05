import Link from "next/link";

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

/* ── Feature/Step data ─────────────────────────────────────── */

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
    gradient: "from-indigo-500/20 to-purple-500/20",
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
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
      </svg>
    ),
    title: "Outreach on autopilot",
    desc: "We craft personalized messages to hiring managers. You only engage when someone actually responds.",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
        <circle cx="18" cy="4" r="3" fill="#818cf8" stroke="none" />
      </svg>
    ),
    title: "Pinged when it matters",
    desc: "The moment a hiring manager responds, you get notified. You decide the next move — no pressure.",
    gradient: "from-rose-500/20 to-orange-500/20",
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
    gradient: "from-emerald-500/20 to-teal-500/20",
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
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
];

const steps = [
  {
    num: "01",
    title: "Join the pool",
    desc: "Upload your resume. Set your preferences — titles, locations, salary floor, blocked employers. Two minutes, tops.",
  },
  {
    num: "02",
    title: "We search while you sleep",
    desc: "Our matching engine runs every night, scanning active listings and scoring them against your background.",
  },
  {
    num: "03",
    title: "Personalized outreach goes out",
    desc: "For every strong match, a tailored message reaches the hiring manager — on your behalf, anonymously.",
  },
  {
    num: "04",
    title: "You get notified",
    desc: "When someone wants to learn more, we ping you. You decide if you want the intro. That's it.",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col noise-bg grid-bg">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full animate-fade-in">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-accent to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
            <GhostIcon className="w-4.5 h-4.5 text-white" />
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
            className="group text-sm bg-accent text-white px-5 py-2.5 rounded-xl hover:bg-accent-dim transition-all font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5"
          >
            Join the pool
            <ArrowRightIcon />
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative px-6 pt-20 pb-32 overflow-hidden">
          {/* Background glow orbs */}
          <div className="hero-glow -top-40 -left-40 opacity-30" />
          <div className="hero-glow -bottom-40 -right-40 opacity-20 delay-200" style={{ animationDelay: "1s" }} />
          <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="animate-fade-up inline-flex items-center gap-2 text-xs bg-accent/10 text-accent-bright border border-accent/20 px-4 py-2 rounded-full mb-10 font-medium backdrop-blur-sm">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Autopilot Recruiting Agency
            </div>

            <h1 className="animate-fade-up delay-100 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]">
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
                className="group btn-shimmer bg-gradient-to-r from-accent to-purple-500 text-white px-10 py-4 rounded-2xl text-sm font-bold hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
              >
                Join Free — It Takes 2 Minutes
                <ArrowRightIcon />
              </Link>
              <a
                href="#how-it-works"
                className="border border-border text-foreground/80 px-8 py-4 rounded-2xl text-sm font-medium hover:bg-surface hover:border-accent/20 transition-all"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* ── Numbers Strip ────────────────────────────── */}
        <section className="border-y border-border/50 bg-surface/30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "0", label: "applications you write" },
              { value: "100%", label: "invisible to employers" },
              { value: "75%+", label: "minimum match score" },
              { value: "$0", label: "to join — forever" },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center animate-fade-up delay-${(i + 1) * 100}`}>
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────── */}
        <section className="px-6 py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4 animate-fade-up">
                Recruiting that runs
                <br />
                <span className="gradient-text">while you sleep</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto text-lg animate-fade-up delay-100">
                Upload once. We handle discovery, outreach, and follow-up — every single night.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`card-glow bg-surface/50 border border-border/50 rounded-2xl p-7 hover:bg-surface transition-all group hover:-translate-y-1 animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-5 text-accent group-hover:scale-110 transition-transform`}>
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

        {/* ── How It Works ─────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-28 relative">
          <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10" />

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4 animate-fade-up">
                Four steps.{" "}
                <span className="gradient-text">Two minutes.</span>
              </h2>
              <p className="text-muted text-lg animate-fade-up delay-100">
                Then we take over.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`card-glow flex gap-6 bg-surface/50 border border-border/50 rounded-2xl p-7 hover:bg-surface hover:-translate-y-0.5 transition-all animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-purple-500 text-white rounded-2xl flex items-center justify-center text-lg font-extrabold flex-shrink-0 shadow-lg shadow-accent/20">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof ─────────────────────────────── */}
        <section className="px-6 py-20 border-y border-border/50 bg-surface/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-12 animate-fade-up">
              Built for people who are <span className="gradient-text">too busy to job hunt</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  quote: "I was passively looking for 6 months. Quietly got me 3 intros in my first week.",
                  name: "Senior Engineer",
                  role: "FAANG → Series B startup",
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
              ].map((t, i) => (
                <div
                  key={t.name}
                  className={`card-glow bg-surface/50 border border-border/50 rounded-2xl p-6 text-left animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">
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

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="px-6 py-32 relative overflow-hidden">
          <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full mb-8 font-medium animate-fade-up">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Free forever to join
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 text-foreground animate-fade-up delay-100">
              We only win{" "}
              <span className="gradient-text">when you win.</span>
            </h2>
            <p className="text-muted mb-4 max-w-md mx-auto text-lg animate-fade-up delay-200">
              No subscription. No hidden fees. We take a placement fee
              only when an intro leads to a hire.
            </p>
            <p className="text-sm text-muted/60 mb-14 animate-fade-up delay-300">
              Upgrade to Priority for faster matching, deeper coverage,
              and more outreach per night.
            </p>
            <div className="animate-fade-up delay-400">
              <Link
                href="/auth/signup"
                className="group btn-shimmer inline-flex items-center bg-gradient-to-r from-accent to-purple-500 text-white px-12 py-4 rounded-2xl text-sm font-bold hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
              >
                Join the pool
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border/50">
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
