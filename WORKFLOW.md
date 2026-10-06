# AI-Assisted Workflow Comparison

For this exercise, I implemented the same ApplyPilot AI Job Preferences feature twice to compare a vague AI prompt with a structured, specification-driven workflow.

## Round 1 — Vague Prompt

For the first round, I used a single short prompt asking the AI to build a job preferences form with validation. I did not provide detailed field requirements, accessibility constraints, edge cases, test cases, or a verification process. The AI produced a working interface quickly using `index.html`, `styles.css`, and `script.js`.

The result looked polished and could be opened directly in the browser, but reviewing it depended almost entirely on manual testing. No automated tests were generated, so there was less evidence that important edge cases had been handled consistently.

## Round 2 — Precise Workflow

For the second round, I used an Explore → Plan → Implement → Test → Verify workflow. The prompt referenced the existing project files and explicitly defined validation, accessibility, responsive design, and testing requirements.

The code diff shows substantial structural differences. The precise branch added a dedicated 58-line `job-preferences.js` validation module and two automated test files: `tests/job-preferences.test.html` and `tests/job-preferences.test.js`. The test JavaScript file alone added 224 lines.

The verification process also caught several AI mistakes. The first implementation incorrectly treated Location as optional even though the specification required it. After fixing that, manual review found duplicate Location error messages. The AI also created a Minimum/Maximum salary range even though the specification requested only one optional Minimum Salary field. These issues were corrected through additional review and tests.

The automated test suite initially reported 8 passed and 1 failed because the integration test fixture was being opened through `file://`. Running it through Live Server exposed the correct browser environment, and the final result was **9 passed, 0 failed**.

## Conclusion

The vague workflow was faster initially, but the precise workflow gave me much stronger confidence in correctness, accessibility, edge-case handling, and maintainability. Although Round 2 required more explicit planning and review, the verification loop made AI mistakes visible before the feature was considered complete.