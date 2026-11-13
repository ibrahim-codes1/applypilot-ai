
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobPreferencesForm from "../components/job-preferences-form.jsx";

const STORAGE_KEY = "applypilot-job-preferences-v1";

async function fillRequiredFields(user) {
  await user.type(
    screen.getByRole("textbox", { name: "Job title" }),
    "Frontend Developer"
  );

  await user.type(
    screen.getByRole("textbox", { name: "Preferred location" }),
    "Toronto"
  );

  await user.click(
    screen.getByRole("checkbox", { name: "Full-time" })
  );

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Experience level" }),
    "Entry level"
  );

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Work arrangement" }),
    "Remote"
  );
}

describe("JobPreferencesForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<JobPreferencesForm />);

    await user.click(
      screen.getByRole("button", { name: "Save preferences" })
    );

    expect(
      screen.getByText("Enter a job title with at least 2 characters.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Enter a preferred location.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Choose at least one valid employment type.")
    ).toBeInTheDocument();

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("rejects a minimum salary of zero", async () => {
    const user = userEvent.setup();
    render(<JobPreferencesForm />);

    await fillRequiredFields(user);

    await user.type(
      screen.getByRole("spinbutton", {
        name: /Minimum salary/,
      }),
      "0"
    );

    await user.click(
      screen.getByRole("button", { name: "Save preferences" })
    );

    expect(
      screen.getByText("Enter a minimum salary greater than $0.")
    ).toBeInTheDocument();

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("saves valid preferences with salary and skills", async () => {
    const user = userEvent.setup();
    render(<JobPreferencesForm />);

    await fillRequiredFields(user);

    await user.type(
      screen.getByRole("spinbutton", { name: /Minimum salary/ }),
      "70000"
    );

    await user.type(
      screen.getByRole("textbox", { name: /Skills \(optional/ }),
      "React, JavaScript, Git"
    );

    await user.click(
      screen.getByRole("button", { name: "Save preferences" })
    );

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Job preferences saved successfully.");

    const saved = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY)
    );

    expect(saved.jobTitle).toBe("Frontend Developer");
    expect(saved.location).toBe("Toronto");
    expect(saved.salaryMin).toBe(70000);
    expect(saved.skills).toEqual(["React", "JavaScript", "Git"]);
  });

  it("allows salary and skills to remain optional", async () => {
    const user = userEvent.setup();
    render(<JobPreferencesForm />);

    await fillRequiredFields(user);

    await user.click(
      screen.getByRole("button", { name: "Save preferences" })
    );

    const saved = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY)
    );

    expect(saved.salaryMin).toBeNull();
    expect(saved.skills).toEqual([]);
    expect(saved.workplace).toBe("Remote");
  });

  it("rejects more than ten skills", async () => {
    const user = userEvent.setup();
    render(<JobPreferencesForm />);

    await fillRequiredFields(user);

    const skills = Array.from(
      { length: 11 },
      (_, index) => `Skill${index + 1}`
    ).join(", ");

    await user.type(
      screen.getByRole("textbox", { name: /Skills \(optional/ }),
      skills
    );

    await user.click(
      screen.getByRole("button", { name: "Save preferences" })
    );

    expect(
      screen.getByText("Add no more than 10 non-empty skills.")
    ).toBeInTheDocument();

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
