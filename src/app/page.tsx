import Link from "next/link";

function SearchIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    { icon: <SearchIcon />, title: "Smart Search", desc: "AI finds roles that match your skills" },
    { icon: <DollarIcon />, title: "Comp Intel", desc: "Know what to ask for" },
    { icon: <EnvelopeIcon />, title: "Cover Letters", desc: "Tailored to each role" },
    { icon: <ChartIcon />, title: "Job Tracker", desc: "Track every application" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto w-full">
        <div className="text-xl font-semibold tracking-tight">
          <span className="text-accent">Q</span>uietly
        </div>
        <Link
          href="/auth/login"
          className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors font-medium"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="inline-block text-xs bg-accent/10 text-accent px-3 py-1 rounded-full mb-6 font-medium">
            No LinkedIn. No public exposure.
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-foreground">
            Job search,{" "}
            <span className="text-accent">quietly</span>.
          </h1>
          <p className="text-lg text-muted mb-8 max-w-lg mx-auto leading-relaxed">
            Upload your resume. Chat with AI. Find roles, get comp data, write
            cover letters, and prep for interviews — all in one private
            conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="bg-accent text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-accent-dim transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="border border-border text-foreground px-8 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {features.map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-xl p-4 text-left">
                <div className="mb-3">{f.icon}</div>
                <div className="text-sm font-medium mb-1 text-foreground">{f.title}</div>
                <div className="text-xs text-muted">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted">
          Quietly &mdash; Your career, your terms. No data shared. Ever.
        </p>
      </footer>
    </div>
  );
}
