# Quietly — AI Recruiting Agency

An AI recruiting agency that runs on autopilot. Candidates join, stay invisible, and we work for them in the background. No employer signups. No marketplace. Just results.

## How it works

1. **Candidate joins** — uploads resume, sets job preferences
2. **Nightly discovery** — engine scans live job boards, finds 75%+ matches
3. **Outreach generated** — personalized messages drafted for hiring managers
4. **Candidate notified** — when a hiring manager responds, candidate decides to engage

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS 3
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** Claude API (resume parsing, job discovery, outreach generation)
- **State:** Zustand
- **PDF:** pdfjs-dist

## Screens

| Route | Description |
|-------|-------------|
| `/` | Landing page — explain concept, collect signups |
| `/auth/signup` | Create account |
| `/auth/login` | Sign in |
| `/app` | Candidate dashboard — matches, outreach status, profile |

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/resume` | Parse PDF resume |
| POST | `/api/cron` | Nightly discovery + outreach (protected by CRON_SECRET) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (for cron) |
| `CRON_SECRET` | Secret to protect cron endpoint |
| `SERPER_API_KEY` | (Optional) For real job search results |

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # Add your keys
npm run dev
```

Run the Supabase schema from `supabase-schema.sql` in your Supabase SQL Editor.
