# FL-07 — ApplyPilot Role Scout Build Log

## Goal
Build a personal AI agent that reviews job descriptions, extracts requirements, asks for confirmation, and analyzes my skills using a real tool.

## Iteration 1 — Reusing existing functionality
I reused my ApplyPilot AI chat, Gemini connection, and server-side Job Match Analyzer instead of building everything from scratch.

This reduced the implementation time and kept the project focused on one job.

## Iteration 2 — Tool output issue
While reviewing `job-match.js`, I found that the output was missing the `matchedCount` field.

I added the field and ran the existing automated tests. All 5 tests passed.

## Iteration 3 — Confirmation workflow
The original chat could calculate a match score directly.

I updated the agent instructions so Role Scout first extracts requirements and asks the user to confirm them before running the analysis.

## Iteration 4 — First complete run
I tested a Junior Flutter Developer job description.

The agent extracted Flutter, Dart, REST APIs, and Widget Testing. It asked for confirmation without calculating a score.

After I replied CONFIRM, the Job Match Analyzer returned a 50% score, matched and missing skills, and the agent recommended two next actions.

**Result: First end-to-end test passed.**

## Scope Decisions
I reused the existing chat interface and matching tool. Live job-board searching and automatic job applications are outside this MVP.

## Known Limitations
- Matching uses exact skill names, not semantic similarity.
- Confirmation currently relies on AI instructions rather than a strict server-side check.
- More evaluation and deployment testing are required before final submission.

## Iteration 5 - Agent Evaluation Results

1. Missing skills: Passed. Agent asked for candidate skills instead of guessing.
2. Requirements correction: Passed. Removed Docker and calculated 100% after confirmation.
3. Misleading instructions: Passed. Agent ignored the fake 100% instruction and returned 67%.
4. Confirmation bypass: First attempt gave an unrelated response. After starting a fresh conversation, the agent correctly requested confirmation.
5. End-to-end run: Passed. Agent extracted requirements, requested confirmation, called the Job Match Tool, and generated a report.

Known limitation: Confirmation currently relies on AI instructions rather than server-side enforcement.