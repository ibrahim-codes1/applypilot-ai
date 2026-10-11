# ApplyPilot AI — FE-05 Capstone Skeleton

A **Next.js App Router** foundation for the ongoing FlyRank Frontend AI Engineering capstone. It does **not** ship job matching or resume parsing yet. This deliverable is intended to be added into the existing ApplyPilot AI GitHub repository under a `next-app/` directory, preserving earlier experimental branches and files.

## What is included

- Root layout, branded responsive navigation, page metadata, 404/loading states.
- App routes: `/dashboard`, `/preferences`, `/resume`, `/matches`, `/applications`, `/settings`, `/health` and `/` redirect.
- Tailwind v4 and base tokens in `app/globals.css`.
- Real internal JSON endpoint `GET /api/health` and client-side fetch+render in `/health` (with loading/error/retry).
- Server Components by default. Only `components/health-probe.jsx` is a Client Component.
- `.env.example` and `.gitignore`; no keys, user accounts or private data.
- [SPEC.md](SPEC.md) (proposed route plan; confirm routes before continuing).

## Run locally

Requirements: Node 20.9+ (Node 22 recommended), npm, internet access for initial dependency install.

```bash
cd next-app # if copied into the existing repository
npm install
npm run dev
```

Open <http://localhost:3000/dashboard> and <http://localhost:3000/health>. Confirm the health page says `Connected` and shows JSON.

```bash
npm run lint
npm run build
npm run start
```

> **Verification status:** The source was syntax-checked with TypeScript's parser in the assembly environment. A Next.js install/build and browser run have **not** been completed there because the npm registry could not be reached. Run the commands above locally before claiming the deployed build works.

## Keep Week 1–2 work safe

The main ApplyPilot AI repository already has Week 2 experimental feature branches (`workflow-vague`, `workflow-precise`) and documentation. This ZIP is **not a replacement** for repository `main`. Recommended integration:

```bash
git clone https://github.com/ibrahim-codes1/applypilot-ai.git
cd applypilot-ai
git checkout main
git pull
# create a feature branch before copying these files
 git checkout -b feat/fe05-nextjs-skeleton
```

Copy the files from this package into `next-app/` **inside the cloned repository**. Then `cd next-app && npm install && npm run build`. Commit `next-app/` plus the generated `package-lock.json`; do not commit `node_modules`, `.env.local` or `.next`. Open a PR to merge the skeleton safely.

## Deployment

1. Push your feature branch to GitHub and connect **the existing `applypilot-ai` repo** to Vercel.
2. In Vercel, choose the Next.js framework and set **Root Directory = `next-app`** (important if the repo also contains original HTML at the root).
3. Set `APP_ENV=preview` in Vercel Preview environment if desired. This is non-secret. Add API credentials only in future milestones, as server-only env vars.
4. Verify the preview deployment on every push. Check `/dashboard`, all links, `/health`, and `/api/health`.
5. Inspect 375px and 1280px in DevTools. Confirm responsive navigation and no horizontal scrolling.
6. Submit **both** the GitHub URL and a **real** Vercel preview URL. We cannot invent the live preview link until deployment succeeds.

See [DEPLOYMENT.md](DEPLOYMENT.md) for a full checklist.

## Security

- `.env*` values excluded from git except `.env.example`.
- Do not add `NEXT_PUBLIC_` prefix to any future secret keys.
- `/api/health` contains only non-sensitive demo readiness information.
- Resume upload/auth/AI features are placeholders. There is no collection of user data at FE-05.

## Source note

This scaffold was created with AI assistance from the uploaded FE-05 brief. No claim is made that the mentor approved this exact route plan or that it is already deployed. See [AI_WORKFLOW.md](AI_WORKFLOW.md) for an accurate development record.
