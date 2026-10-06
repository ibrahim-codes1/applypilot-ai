# ApplyPilot AI

ApplyPilot AI is an AI-powered job application assistant designed to help job seekers better understand job requirements, identify key skills, and prepare stronger applications.

## Job preferences form

Open `index.html` in a browser to use the responsive job preferences form. It collects a target role, employment types, experience level, work arrangement, required location, one optional minimum salary, and skills. A minimum salary must be greater than zero when entered. Preferences are saved locally in the browser and restored when the form is reopened; they are not sent to a server.

## Automated tests

Open `tests/job-preferences.test.html` in a modern browser to run the dependency-free automated validation and form-submission integration tests. The integration test submits the real form with required fields empty and verifies that missing or whitespace-only locations produce accessible field errors without saving, then confirms a valid location saves successfully. Each test result is reported on the page.

## Project Overview

This capstone project focuses on creating a user-friendly application that helps job seekers evaluate opportunities more effectively. By combining a responsive frontend experience with AI-assisted analysis, ApplyPilot AI supports smarter application preparation and better alignment between a candidate's background and a job's requirements.

## Planned Features

- AI-powered job description analysis
- Required skills extraction
- Resume and job matching
- Missing skills identification
- AI-generated cover letters
- Interview question generation
- Saved applications dashboard
- Application status tracking
- Responsive and accessible user interface

## Planned Technology Stack

- React
- JavaScript
- HTML5
- CSS3
- Node.js
- AI API integration
- Git and GitHub

## Project Status

The project is under active development, with foundational functionality introduced incrementally.