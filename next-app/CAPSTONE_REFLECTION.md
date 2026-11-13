# ApplyPilot AI — Capstone Reflection & Evidence

**Date:** November 13, 2026

## Problem

Candidates often struggle to translate job descriptions into a concrete assessment of their current skills and next steps. A generic AI chat can help with preparation, but unstructured replies are difficult to compare or verify.

## What I built

I developed ApplyPilot AI, a responsive Next.js career workspace with a streaming AI career coach and a Role Scout workflow. Users provide their skills and a job description; the assistant helps identify requirements and, for the guided workflow, requests confirmation before calling a server-side matching tool. The UI displays a structured percentage, matched and missing skills, and suggested improvement actions.

The skill match is deliberately deterministic, based on normalized exact names. The AI helps structure the conversation, while the tool calculates the score. This separation makes the arithmetic explainable and testable.

I also added a validated job-preferences form, local chat persistence, error/retry feedback, component tests, an E2E test using mocked AI, CI checks, and Vercel deployment.

## Outcome

- 15 of 15 component tests passed in a local Vitest run on November 13, 2026.
- The local Next.js production build completed successfully.
- A tested Role Scout example correctly showed 50% skill coverage, with Flutter and Dart matched and REST APIs and Widget Testing missing.
- GitHub PR checks passed and Vercel showed a **Ready** production deployment of `main` at `0b93135`.
- A chat-page WAVE audit identified zero automated errors and zero contrast errors; keyboard and two key screen-reader announcements were manually checked.

The live production Role Scout flow has not yet been independently confirmed; that remains a final smoke-test task.

## Key engineering decisions

1. **Structured tool output instead of only prose:** A result card makes scores and missing skills inspectable and consistent.
2. **Deterministic matching:** The same normalized skills and requirements produce the same numerical result. This is more auditable than asking an LLM to invent a percentage.
3. **Server-only secrets:** Provider keys belong in server environment variables rather than frontend code.
4. **Incremental testing:** Component, UI, manual, build, and deployment checks were run at separate points instead of relying on screenshots alone.
5. **Measured optimization:** A Markdown lazy-loading experiment produced worse observed Lighthouse results and was rolled back rather than retained without evidence.

## Challenges and what I learned

**Incomplete job inputs.** In an early test, the model supplied unstated job requirements and reported an inappropriate match. A partial server-side gating heuristic and prompt adjustments improved the tested missing-input case. This revealed that model instructions alone do not guarantee provenance or valid confirmation; stronger server-side state validation is necessary.

**Performance uncertainty.** The dashboard achieved an 85 performance score in one local audit, but the chat page remained below the target. Testing empty history showed little difference. Lazy loading Markdown did not produce a reliable win and was rolled back. I learned to treat Lighthouse as a diagnostic measure, repeat tests in comparable conditions, and avoid declaring improvements from one result.

**Avoiding accidental file changes.** During iterative debugging, a component was overwritten with test code. Restoring from VS Code local history, verifying exported functions, and running a full test/build cycle recovered the project. This reinforced the value of narrow Git staging, version history, and small verified changes.

**Stacked pull requests.** The implementation passed through a feature branch, the Role Scout branch, and the reliability branch before reaching `main`. Checking base/head branches and CI before each merge helped avoid accidentally confusing preview deployment with production release.

## What I would improve next

- Implement server-enforced confirmation state and requirement provenance, with robust negative tests.
- Improve chat initial-load responsiveness using trace-based profiling and repeated mobile audits.
- Confirm operational protections: rate limiting, secret handling, error monitoring, and production smoke tests.
- Update older dashboard copy that still describes working Role Scout matching as planned; carefully distinguish it from live job discovery, which does remain planned.
- Extend accessible live announcements and screen-reader coverage during streaming.
- Add validated persistence/authentication and genuine job-board integrations only as future features.

## Evidence checklist

Add screenshots of your own tests and UI to a repository evidence folder (e.g., `next-app/evidence/`) **only after reviewing them for secrets and personal data**.

- [ ] Role Scout chat showing requirements confirmation
- [ ] 50% structured Job Match card with matched/missing skills
- [x] Terminal Vitest result: 15/15 passed (observed)
- [x] Terminal Next.js optimized build success (observed)
- [x] WAVE 0 errors / 0 contrast errors screenshot (observed)
- [x] Vercel Production Ready on `main` at `0b93135` (observed)
- [ ] Production AI response and Role Scout card (not yet verified)
- [ ] Final post-rollback chat Lighthouse result

## Submission summary

**Problem →** Job seekers need clearer, actionable interpretation of requirements.  
**What I built →** Next.js streaming career coach, AI-guided Role Scout, deterministic skill-matching tool, accessible structured result card, automated tests, and CI/CD.  
**Outcome →** Locally verified 50% test case, 15/15 component tests passing, a successful production build, and a Ready Vercel deployment. Remaining work includes the live AI smoke test, stronger server-side confirmation and performance improvements.
