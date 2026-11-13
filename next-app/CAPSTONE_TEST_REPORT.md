# ApplyPilot AI — Capstone Test & Deployment Report

**Report date:** November 13, 2026  
**Application:** https://applypilot-ai-kappa.vercel.app  
**Repository:** https://github.com/ibrahim-codes1/applypilot-ai

## 1. Scope

This report records checks performed on the Next.js career chat and Role Scout skill-matching workflow. Results are evidence of the specific tests performed—not proof that every production path, security boundary, or accessibility requirement is satisfied.

## 2. Verification summary

| Area | Result | Evidence / caveat |
|---|---|---|
| Component tests | **Pass — 15/15** | Vitest, three test files, local run on Nov 13 |
| Production build | **Pass** | `npm run build`, Next.js 16.4.3 |
| E2E test | **Pass — 1/1 (earlier run)** | Playwright test uses a mocked AI response; rerun at release |
| GitHub PR checks | **Pass — 4 checks** | Observed on PR #7 and PR #5 and the PR #4 merge |
| Vercel deployment | **Ready** | Production, `main`, merge `0b93135`, Nov 13 |
| Role Scout manual preview test | **Pass on tested case** | Confirmation then 50% card for Flutter example |
| Role Scout production smoke test | **Pending** | Deployment status does not guarantee provider/configuration works |
| WAVE `/chat` | **0 errors, 0 contrast errors** | Three redundant-link alerts remain |
| Keyboard + Windows Narrator | **Pass on tested controls** | Labels, focus, Tab/Enter checked; not full screen-reader audit |
| Mobile `/dashboard` performance | **85/100 (one run)** | Not a reproducible guarantee |
| Mobile `/chat` performance | **76/100 clean-session baseline** | 85+ target not yet demonstrated |

## 3. Test details

### Component tests

Command: `npx vitest run` from `next-app/`.

Observed output: `Test Files 3 passed (3)`, `Tests 15 passed (15)`.

- `tests/chat-workspace.test.jsx`: 5 tests (pending feedback, streamed text, accessible Markdown, Job Match tool results, retry/error behavior).
- `tests/job-match-tool-card.test.jsx`: 5 tests for tool card behavior and states.
- `tests/job-preferences-form.test.jsx`: 5 tests for required/optional fields, salary limits, and skills limit.

### Build

Command: `npm run build`.

Observed Next.js 16.4.3 (Turbopack) optimized build completed without errors. Routes included `/dashboard`, `/chat`, `/preferences`, `/api/chat`, and `/api/health`.

### AI workflow manual checks

On the locally tested feature version:

1. Job description requiring Flutter, Dart, REST APIs, Widget Testing plus skills Flutter, Dart, Firebase resulted in **50%**, with the correct matched/missing lists.
2. `ROLE SCOUT:` guided workflow requested `CONFIRM` before running analysis; `CONFIRM` then produced the structured 50% result.
3. A message with only skills and no stated requirements prompted for missing information rather than generating a score in the tested case.
4. An adversarial instruction embedded in the supplied job description did not bypass confirmation or force 100% in the tested case.

**Important limitation:** These are sampled inputs, not comprehensive prompt-injection protection. Confirmation and source-of-requirement checks need robust server-side enforcement.

## 4. Accessibility

- Lighthouse Mobile clean-chat audit: Accessibility **96**, Best Practices **96**, SEO **100**.
- WAVE: **0 errors**, **0 contrast errors**, **3 redundant link alerts** (likely overlapping destinations such as logo/dashboard link; review individually).
- Keyboard: Tab navigation, visible focus, and Enter control activation were manually confirmed.
- Windows Narrator: "Your message" input and "Send" button announced correctly.

Further work: test complete keyboard use during streaming, stop/retry, dynamic announcements, zoom/reflow, mobile assistive technologies, and the three WAVE alerts. Automated accessibility tools do not guarantee WCAG AA compliance.

## 5. Lighthouse performance observations

| Page / experiment | Performance | FCP | LCP | TBT | Speed Index | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Dashboard, production-mode local (prefetch experiment) | 85 | Not captured in final run | Not captured in final run | Not captured in final run | Not captured | Not captured |
| Chat, with history (before lazy-loading) | 75 | 0.8s | 2.9s | 890ms | 1.6s | 0 |
| Chat, incognito empty-history baseline | 76 | Not recorded | Not recorded | Not recorded | Not recorded | Not recorded |
| Chat, Markdown lazy-loading experiment | 61 | 1.6s | 2.9s | 1,300ms | 11.1s | 0 |

**Action:** Markdown lazy-loading was rolled back after the unfavorable result; original inline Markdown renderer restored, 15/15 tests passing, build passing. There is **no measured post-rollback chat audit yet**. Do not report the chat page as meeting the 85+ performance goal.

## 6. Deployment trail

1. `feature/fe09-automated-testing` commit `aaa8c95` pushed to origin (navigation link prefetch optimization).
2. PR #7 merged into `feature/fl07-role-scout-agent` after green checks.
3. PR #5 merged into `feature/checkpoint1-reliability` after green checks.
4. PR #4 merged into `main`, merge commit `0b93135` after green checks.
5. Vercel Deployments view showed **Production / Ready / main / 0b93135**.

**Pending:** Validate a real AI streaming response and Role Scout confirmation/score on the production URL, and check configuration and operational controls. This is separate from the successful deployment/build checks.

## 7. Release blockers and improvements

- [ ] Complete production Role Scout end-to-end smoke test (include confirmation and exact 50% example)
- [ ] Confirm production AI provider credentials without exposing them
- [ ] Confirm server-side rate limiting and input validation meet deployment requirements
- [ ] Repeat controlled `/chat` performance audits after rollback (ideally 3 consistent runs)
- [ ] Review and document three WAVE redundant-link alerts
- [ ] Update outdated FE-06 dashboard labels/copy
- [ ] Save dated screenshots or logs in a suitable evidence folder, excluding secrets and private chat data

## 8. Reproducible commands

From `next-app/`:

```bash
npm install
npx vitest run
npx playwright test
npm run build
npm run lint
```

Use `npm run start` to audit the production build locally. For a live production smoke test, use https://applypilot-ai-kappa.vercel.app/chat.
