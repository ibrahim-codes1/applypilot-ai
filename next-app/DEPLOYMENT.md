# FE-05 Deployment and submission checklist

## Local verification (must run before publishing)

- [ ] `npm install` finishes and creates `package-lock.json`.
- [ ] `npm run lint` and `npm run build` both succeed.
- [ ] `/`, `/dashboard`, `/preferences`, `/resume`, `/matches`, `/applications`, `/settings`, `/health`, `/api/health` work locally.
- [ ] `/health` fetches JSON and shows `Connected`; retry changes the timestamp.
- [ ] Browser viewport at 375px and 1280px has no sideways scrolling; mobile menu expands.
- [ ] The source contains no real API keys, passwords or `.env.local`.

## Safe GitHub integration

1. Clone `https://github.com/ibrahim-codes1/applypilot-ai` and switch to `main`.
2. Pull latest, create `feat/fe05-nextjs-skeleton` branch.
3. Copy this scaffold into a new `next-app/` directory; do not replace existing Week 2 files or the workflow branches.
4. Run `npm install` in `next-app/`, verify build, then commit and push feature branch.
5. Open a PR. When merged, the same Vercel project can deploy the default branch.

## Vercel settings

- Import the **existing ApplyPilot AI GitHub repository**.
- Framework preset: **Next.js**.
- Root directory: **`next-app`**.
- Build command: default (`next build`).
- Non-secret environment variable (optional): `APP_ENV=preview` for Preview.
- Do not add an AI provider key yet; there is no AI provider integration in FE-05.
- Pushes to branches should create preview deployments. Verify using a second push after initial import.

## Actual submission

- GitHub link: `https://github.com/ibrahim-codes1/applypilot-ai` (update link to the submitted branch or PR if not merged).
- Vercel preview link: **[ADD THE REAL DEPLOYMENT URL AFTER VERCEL CONFIRMS SUCCESS]**.
- Evidence: screenshots of `/dashboard` and `/health` at 375px and 1280px; optional deployment dashboard with successful build.
- Never submit the source ZIP alone as a substitute for the required live URL.
