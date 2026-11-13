# ApplyPilot AI — Release Checklist

**Target deployment:** https://applypilot-ai-kappa.vercel.app  
**Last verified deployment:** `main` @ `0b93135` — Vercel **Ready**, Nov 13, 2026.

## Before marking the release complete

- [x] Changes merged into `main` through reviewed PRs
- [x] GitHub PR checks passed (4 checks on merge)
- [x] Vitest 15/15 passed locally
- [x] Next.js optimized build passed locally
- [x] Vercel production deployment displayed Ready
- [ ] Confirm `/api/health` responds appropriately on the live domain
- [ ] Check server-side AI provider configuration in Vercel; do not reveal the key
- [ ] Send a live streaming chat prompt and confirm a complete AI reply
- [ ] Test live Role Scout using confirmed job requirements and check correct 50% result
- [ ] Confirm behavior when requirements are omitted; no invented score
- [ ] Confirm provider errors, cancellation, and retry UI in production
- [ ] Verify server-side validation, rate limiting, and abuse controls
- [ ] Record browser/mobile smoke-test screenshots without secrets
- [ ] Audit current production Lighthouse metrics; note chat 85+ goal still open
- [ ] Review three WAVE redundant-link alerts

## Live smoke-test prompt

```text
ROLE SCOUT:

My skills: Flutter, Dart, Firebase.
Job requirements: Flutter, Dart, REST APIs, Widget Testing.
Job title: Junior Flutter Developer.
Analyze my job match.
```

Expected guided sequence: request confirmation → user sends `CONFIRM` → a 50% result with Flutter and Dart matched and REST APIs and Widget Testing missing. Stop and investigate if the tool invents extra requirements or computes an unexplained score.

## Rollback plan

1. Identify the last verified good Production deployment in **Vercel → Project → Deployments**.
2. If a newly deployed version causes a serious regression, use Vercel's available production rollback/redeploy controls to restore that verified deployment according to the team's release policy.
3. If code rollback is required, revert the offending commit in Git through a reviewed PR instead of rewriting `main` history.
4. Re-run smoke tests and confirm the deployment status is Ready before declaring recovery.

Do not expose `.env.local`, API keys, browser chat data, or private test messages in logs or screenshots.
