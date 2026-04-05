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

        {/* ── The Bet (founder voice, replaces fake testimonials) */}
        <section className="px-6 py-24 border-y border-border">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8 animate-fade-up">
              Why this exists
            </h2>
            <div className="space-y-5 text-base sm:text-lg text-muted leading-relaxed">
              <p className="animate-fade-up delay-100">
                One week you&apos;re heads-down shipping. The next week, thousands of
                people at Oracle are told their roles no longer exist. Entire teams
                at Google, Meta, Stripe — gone in a single email. It doesn&apos;t matter
                how good you are. The ground shifts fast and it doesn&apos;t send a warning.
              </p>
              <p className="animate-fade-up delay-200">
                The people who land on their feet aren&apos;t the ones who panic-apply
                to 200 jobs the day after. They&apos;re the ones who were already in motion —
                quietly, invisibly, with conversations already warm before the news hit.
              </p>
              <p className="animate-fade-up delay-300 text-foreground font-semibold">
                That&apos;s what Quietly does. We keep you in motion while you focus on
                your work. Scanning roles every night, reaching out to hiring managers
                on your behalf, and only interrupting your life when someone actually
                wants to talk. Your employer never knows. You stay invisible the entire time.
              </p>
              <p className="animate-fade-up delay-400 text-sm text-muted/70">
                This isn&apos;t about looking for a job. It&apos;s about never being caught
                standing still when the ground moves.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────── */}
        <section className="px-6 py-28 bg-surface/50">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-foreground">
              <span className="gradient-text">$20/mo.</span> Cancel anytime.
            </h2>
            <p className="text-muted text-lg mb-10 max-w-md mx-auto">
              No contracts. No placement fees. Just nightly scans, personalized
              outreach, and notifications when hiring managers respond.
            </p>

            <Link
              href="/auth/signup"
              className="group btn-shimmer inline-flex items-center bg-gradient-to-r from-accent to-purple-500 text-white px-12 py-4 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5"
            >
              Get started
              <ArrowRightIcon />
            </Link>

            <p className="text-xs text-muted mt-4">
              2 minutes to set up. First matches within 24 hours.
            </p>
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
