import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto w-full">
        <div className="text-xl font-semibold tracking-tight">
          <span className="text-accent">Q</span>uietly
        </div>
        <Link
          href="/app"
          className="text-sm bg-accent text-background px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors font-medium"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="inline-block text-xs bg-accent/10 text-accent px-3 py-1 rounded-full mb-6 font-medium">
            No LinkedIn. No public exposure.
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
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
              href="/app"
              className="bg-accent text-background px-8 py-3 rounded-xl text-sm font-semibold hover:bg-accent-dim transition-colors"
            >
              Start Searching
            </Link>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {[
              { icon: "🔍", title: "Smart Search", desc: "AI finds roles that match your skills" },
              { icon: "💰", title: "Comp Intel", desc: "Know what to ask for" },
              { icon: "✉️", title: "Cover Letters", desc: "Tailored to each role" },
              { icon: "📊", title: "Job Tracker", desc: "Track every application" },
            ].map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-xl p-4 text-left">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-sm font-medium mb-1">{f.title}</div>
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
