# FE-07 - Generative UI and Tool Calling

## Project
ApplyPilot AI - AI Career Coach

## Tool
Name: analyzeJobMatch
File: lib/tools/job-match.js

The tool compares candidate skills with job requirements
using exact, case-insensitive skill matching.

## Input Schema (Zod)
- jobTitle: optional string (2-80 characters)
- skills: array of 1-20 skill strings
- requirements: array of 1-20 requirement strings
- Each skill string: 1-60 characters

## Output
- jobTitle: string
- score: percentage (number)
- matchedSkills: string array
- missingSkills: string array
- matchedCount: number
- totalRequirements: number
- method: string

Score = matched requirements / unique requirements * 100

## Generative UI
Component: components/job-match-tool-card.jsx

Supported states:
- input-streaming: loading indicator
- input-available: analysis in progress
- output-available: structured score card
- output-error: error message card

## Example
Candidate: Flutter, Dart, Firebase
Requirements: Flutter, Dart, REST APIs, Widget Testing

Result: 50% match
Matched: Flutter, Dart
Missing: REST APIs, Widget Testing

## Tests
Command: node --test tests/job-match.test.mjs

Results: 5 passed, 0 failed.

Tests cover 0%, 50%, 100%, duplicate requirements
and invalid input.

Manual testing confirmed successful tool execution,
incomplete-input handling, and graceful tool errors.

## Run Locally
npm install
npm run dev

Open http://localhost:3000/chat

The server requires a configured AI provider API key.
Never commit .env.local or API keys.

## Build
npm run build
Result: Passed.

## Limitations
This tool performs exact skill-name matching.
The score does not predict hiring success.
