import Link from "next/link";
import ProcessDemo from "@/components/landing/ProcessDemo";
import ScrollReveal from "@/components/landing/ScrollReveal";
import HeroNotification from "@/components/landing/HeroNotification";
import Ticker from "@/components/landing/Ticker";

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
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full animate-fade-in">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-foreground rounded-xl flex items-center justify-center group-hover:bg-foreground/80 transition-colors">
            <GhostIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-serif tracking-tight text-foreground">
            Quietly
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/auth/login"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="group text-sm bg-foreground text-white px-5 py-2.5 rounded-xl hover:bg-foreground/80 transition-all font-medium"
          >
            Get started
            <ArrowRightIcon />
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 overflow-hidden">
          <div className="hero-glow -top-60 left-1/4 w-[800px] h-[600px] opacity-40" />
          <div className="hero-glow -bottom-40 right-0 w-[600px] h-[600px] opacity-30" style={{ animationDelay: "2s" }} />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: copy */}
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                <h1 className="animate-fade-up font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-8 leading-[1.1] text-foreground">
                  Stop applying.
                  <br />
                  <span className="italic text-accent">Start getting found.</span>
                </h1>

                <p className="animate-fade-up delay-100 text-lg text-muted mb-4 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Join the pool. Stay invisible. We find the roles, reach out to
                  hiring managers, and only bother you when someone actually
                  wants to talk.
                </p>

                <p className="animate-fade-up delay-200 text-sm text-stone-400 mb-10">
                  No applications. No employer signups. No marketplace.
                </p>

                <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/auth/signup"
                    className="group btn-shimmer bg-foreground text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-foreground/80 transition-all"
                  >
                    Start for $20/mo
                    <ArrowRightIcon />
                  </Link>
                  <a
                    href="#demo"
                    className="border border-stone-200 text-foreground px-8 py-3.5 rounded-xl text-sm hover:bg-surface transition-all"
                  >
                    Watch it work
                  </a>
                </div>
              </div>

              {/* Right: looping notification */}
              <div className="animate-fade-up delay-400 flex-shrink-0 hidden sm:block">
                <HeroNotification />
              </div>
            </div>
          </div>
        </section>

        {/* ── Ticker ────────────────────────────────────── */}
        <Ticker />

        {/* ── Live Demo ────────────────────────────────── */}
        <section id="demo" className="px-6 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-4">
                  Watch how it <span className="italic text-accent">actually works</span>
                </h2>
                <p className="text-muted max-w-lg mx-auto text-lg">
                  This is what happens after you join. Every night. While you sleep.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <ProcessDemo />
            </ScrollReveal>
          </div>
        </section>

        {/* ── Why this exists ──────────────────────────── */}
        <section className="px-6 py-24 sm:py-32 bg-surface">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-10">
                Why this exists
              </h2>
            </ScrollReveal>

            <div className="space-y-6 text-base sm:text-lg text-muted leading-relaxed">
              <ScrollReveal delay={100}>
                <p>
                  The ground shifts fast and it doesn&apos;t send a warning.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <p>
                  The people who land on their feet aren&apos;t the ones who panic-apply
                  to 200 jobs the day after. They&apos;re the ones who were already in motion —
                  quietly, invisibly, with conversations already warm before the news hit.
                </p>
              </ScrollReveal>

              {/* Pull quote */}
              <ScrollReveal delay={200}>
                <blockquote className="border-l-[3px] border-accent pl-6 py-2 my-8">
                  <p className="font-serif text-xl sm:text-2xl text-foreground italic leading-snug">
                    This isn&apos;t about looking for a job. It&apos;s about never being
                    caught standing still when the ground moves.
                  </p>
                </blockquote>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <p className="text-foreground font-medium">
                  That&apos;s what Quietly does. We keep you in motion while you focus on
                  your work. Scanning roles every night, reaching out to hiring managers
                  on your behalf, and only interrupting your life when someone actually
                  wants to talk. Your employer never knows. You stay invisible the entire time.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <p>
                  No resumes blasted into the void. No awkward LinkedIn updates. No
                  recruiter calls during lunch. Just a system running in the background,
                  making sure that when opportunity knocks, it&apos;s already knocking for you.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────── */}
        <section className="px-6 py-24 sm:py-32">
          <div className="max-w-xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl mb-4 text-foreground">
                <span className="italic text-accent">$20/mo.</span> Cancel anytime.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted text-lg mb-10 max-w-md mx-auto">
                No contracts. No placement fees. Just nightly scans, personalized
                outreach, and notifications when hiring managers respond.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Link
                href="/auth/signup"
                className="group btn-shimmer inline-flex items-center bg-foreground text-white px-10 py-4 rounded-xl text-sm font-medium hover:bg-foreground/80 transition-all"
              >
                Get started
                <ArrowRightIcon />
              </Link>
              <p className="text-sm text-stone-400 mt-4">
                2 minutes to set up. First matches within 24 hours.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────── */}
        <section className="px-6 py-24 sm:py-32 bg-surface relative overflow-hidden">
          <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-40" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl mb-6 text-foreground">
                Your next role is already{" "}
                <span className="italic text-accent">out there.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted mb-10 max-w-md mx-auto text-lg">
                Let us find it while you focus on what matters.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Link
                href="/auth/signup"
                className="group btn-shimmer inline-flex items-center bg-foreground text-white px-10 py-4 rounded-xl text-sm font-medium hover:bg-foreground/80 transition-all"
              >
                Join Quietly — $20/mo
                <ArrowRightIcon />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-lg flex items-center justify-center">
              <GhostIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-serif text-foreground">Quietly</span>
          </div>
          <p className="text-xs text-stone-400">
            Your career on autopilot. No data shared. Ever.
          </p>
          <div className="flex gap-6 text-xs text-stone-400">
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
