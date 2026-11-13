
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JobMatchToolCard from "../components/job-match-tool-card.jsx";

describe("JobMatchToolCard", () => {
  it("shows a loading status while AI prepares the analysis", () => {
    render(
      <JobMatchToolCard
        part={{ state: "input-streaming" }}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Preparing job analysis"
    );
  });

  it("shows the number of skills and requirements being analyzed", () => {
    render(
      <JobMatchToolCard
        part={{
          state: "input-available",
          input: {
            jobTitle: "Flutter Developer",
            skills: ["Flutter", "Dart", "Firebase"],
            requirements: ["Flutter", "Dart", "REST APIs", "Testing"],
          },
        }}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Analyzing job requirements"
    );

    expect(screen.getByText("Flutter Developer")).toBeInTheDocument();

    expect(
      screen.getByText(/Comparing 3 skills against 4 requirements/)
    ).toBeInTheDocument();
  });

  it("displays a 50% match with matched and missing skills", () => {
    render(
      <JobMatchToolCard
        part={{
          state: "output-available",
          output: {
            jobTitle: "Flutter Developer",
            score: 50,
            matchedCount: 2,
            totalRequirements: 4,
            matchedSkills: ["Flutter", "Dart"],
            missingSkills: ["REST APIs", "Widget Testing"],
          },
        }}
      />
    );

    expect(screen.getByText("50%")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", {
        name: "Skill match percentage",
      })
    ).toHaveAttribute("aria-valuenow", "50");

    expect(
  screen.getByRole("heading", { name: "Flutter Developer" })
).toBeInTheDocument();

expect(
  screen.getByText(/✓\s*Flutter/)
).toBeInTheDocument();
    expect(screen.getByText(/Dart/)).toBeInTheDocument();
    expect(screen.getByText("REST APIs")).toBeInTheDocument();
    expect(screen.getByText("Widget Testing")).toBeInTheDocument();
    expect(
      screen.getByText(/2 of 4 requirements matched/)
    ).toBeInTheDocument();
  });

  it("shows completion feedback when all skills match", () => {
    render(
      <JobMatchToolCard
        part={{
          state: "output-available",
          output: {
            jobTitle: "Python Developer",
            score: 100,
            matchedCount: 3,
            totalRequirements: 3,
            matchedSkills: ["Python", "Django", "PostgreSQL"],
            missingSkills: [],
          },
        }}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen.getByText("All listed requirements matched.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar")
    ).toHaveAttribute("aria-valuenow", "100");
  });

  it("shows an accessible error when analysis fails", () => {
    render(
      <JobMatchToolCard
        part={{
          state: "output-error",
          errorText: "Tool execution failed",
        }}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Job analysis failed"
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please review your input and try again."
    );
  });
});
