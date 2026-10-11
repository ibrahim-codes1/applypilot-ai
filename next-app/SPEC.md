# ApplyPilot AI — Capstone specification (FE-05 draft)

## Problem and audience

Job seekers, particularly students and early-career developers, repeatedly review listings and compare requirements against their experience. ApplyPilot AI is intended to help capture preferences and eventually explain relevant opportunities. **FE-05 is a deployed route skeleton, not a functioning matching product.**

## Direction and scope

Continue the existing ApplyPilot AI concept already used for the Week 2 job-preferences workflow exercise. Keep those experimental branches intact. A production preference feature and real AI matching remain future work. This draft route map was created for FE-05 because a final screen-by-screen spec was not supplied here; confirm it before subsequent milestones.

| Route | Screen | FE-05 status | Future scope |
|---|---|---|---|
| `/` | Redirect to dashboard | Scaffolded | — |
| `/dashboard` | Workspace overview | Scaffolded | Personalized insights |
| `/preferences` | Job preferences | Placeholder | Adopt verified Week 2 form as React client component |
| `/resume` | Resume workspace | Placeholder | Secure upload/parse |
| `/matches` | AI job matches | Placeholder | Real jobs + explainable LLM match |
| `/applications` | Application tracker | Placeholder | Track job statuses |
| `/settings` | Workspace controls | Placeholder | Privacy/account controls |
| `/health` | Health-check page | Client fetches `/api/health` | Future dependent-service checks |
| `/api/health` | JSON API route | Implemented | Health/readiness data |

## FE-05 acceptance criteria

- App Router root layout, nav and all listed page routes.
- Server Components for pages/layout/navigation by default; only health fetch UI is a Client Component.
- Tailwind CSS v4, centralized design tokens.
- Mobile layout at 375px and desktop at 1280px.
- Health page renders fetched data from `/api/health`.
- `.env.example` and `.gitignore`, no committed secret values.
- Live Git-connected preview URL and repository link **must be supplied by the user after deployment**.

## Technology

Next.js 16 (App Router), React 19, Tailwind CSS v4. No auth, LLM, backend database or secret API keys implemented yet. The health endpoint is internal and returns no sensitive information.

## Milestone continuity

This FE-05 scaffold should become the foundation of the ongoing ApplyPilot AI capstone through FE-06, FE-07, FE-08 and final submission. The independent Week 3 JobTrack practice app is separate.
