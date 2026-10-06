# ApplyPilot AI - Development Guidelines

## Project Overview

ApplyPilot AI is an AI-powered job application assistant that helps job seekers analyze job descriptions and prepare stronger applications.

## Planned Tech Stack

- React
- JavaScript
- HTML5
- CSS3
- Node.js
- AI API integration
- Git and GitHub

## Planned Features

- Job description analysis
- Required skills extraction
- Resume and job matching
- Missing skills identification
- AI-generated cover letters
- Interview question generation
- Saved applications dashboard
- Application status tracking

## Development Conventions

- Use clear and descriptive variable and function names.
- Keep components small and reusable.
- Follow semantic HTML practices.
- Build responsive interfaces.
- Maintain accessibility throughout the application.
- Avoid unnecessary dependencies.
- Keep code simple and readable.
- Add comments only where they improve understanding.

## Git Conventions

Use Conventional Commits.

Examples:

- `feat: add job analysis form`
- `fix: resolve mobile navigation issue`
- `docs: update project documentation`
- `refactor: simplify application card`
- `chore: update dependencies`

## AI Assistant Guidelines

When generating or modifying code:

1. Follow the existing project structure and conventions.
2. Explain significant architectural changes before implementing them.
3. Prefer simple solutions over unnecessary complexity.
4. Do not introduce dependencies without a clear reason.
5. Maintain responsive design and accessibility.
6. Review generated code for errors before considering a task complete.

## Rules Learned from Week 2

1. Job preference forms must block submission when required fields are empty or contain only whitespace.

2. Form fields must use accessible labels and a single field-level validation message; duplicate error messages are not allowed.

3. Optional salary inputs must accept an empty value, but when provided they must be numeric and greater than zero.

4. New form validation logic must include automated tests for valid input, missing required fields, whitespace-only input, and numeric edge cases.

5. A feature is not considered complete until manual browser verification and the automated test suite both pass.