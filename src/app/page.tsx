import Link from "next/link";

function ShieldIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

export default function LandingPage() {
  const features = [
    { icon: <ShieldIcon />, title: "Stay invisible", desc: "You never appear on any job board. We work for you in the background." },
    { icon: <BoltIcon />, title: "Matched nightly", desc: "Our engine scans live listings every night and finds roles that fit." },
    { icon: <EnvelopeIcon />, title: "Outreach on autopilot", desc: "We contact hiring managers on your behalf. You only engage when they respond." },
    { icon: <ChartIcon />, title: "Track everything", desc: "See which roles were found, which managers were contacted, and who replied." },
  ];

  const steps = [
    { num: "01", title: "Join the pool", desc: "Upload your resume and set your preferences. Takes 2 minutes." },
    { num: "02", title: "We search for you", desc: "Every night, our engine finds roles that match your background at 75%+ fit." },
    { num: "03", title: "We reach out", desc: "For every strong match, we generate a personalized message to the hiring manager." },
    { num: "04", title: "You get notified", desc: "When a hiring manager responds, you decide if you want an intro. No pressure." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto w-full">
        <div className="text-xl font-semibold tracking-tight">
          <span className="text-accent">Q</span>uietly
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-muted hover:text-foreground transition-colors font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors font-medium"
          >
            Join the pool
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex items-center justify-center px-6 py-20">
          <div className="max-w-2xl text-center">
            <div className="inline-block text-xs bg-accent/10 text-accent px-3 py-1 rounded-full mb-6 font-medium">
              An AI recruiting agency that works for you
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-foreground">
              Your career,{" "}
              <span className="text-accent">on autopilot</span>.
            </h1>
            <p className="text-lg text-muted mb-4 max-w-lg mx-auto leading-relaxed">
              Join the pool. Stay invisible. We find roles that fit you,
              contact hiring managers on your behalf, and notify you when
              someone wants to talk.
            </p>
            <p className="text-sm text-muted mb-8">
              No employer signups. No marketplace. Just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/signup"
                className="bg-accent text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-accent-dim transition-colors"
              >
                Join Free
              </Link>
              <a
                href="#how-it-works"
                className="border border-border text-foreground px-8 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-xl p-5 text-left">
                <div className="mb-3">{f.icon}</div>
                <div className="text-sm font-semibold mb-1 text-foreground">{f.title}</div>
                <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-6 py-20 bg-surface">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 text-foreground">How it works</h2>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Free to join. We only win when you win.
            </h2>
            <p className="text-muted mb-8">
              No subscription required. We take a placement fee only when an
              intro leads to a hire. Upgrade to Priority for faster matching
              and more outreach.
            </p>
            <Link
              href="/auth/signup"
              className="bg-accent text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-accent-dim transition-colors"
            >
              Join the pool
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-border">
        <p className="text-xs text-muted">
          Quietly &mdash; Your career on autopilot. No data shared. Ever.
        </p>
      </footer>
    </div>
  );
}
