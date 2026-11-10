
"use client";

import { useState } from "react";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_ARRANGEMENTS,
  normalizeSkill,
  validatePreferences,
} from "../lib/job-preferences-validation.mjs";

const STORAGE_KEY = "applypilot-job-preferences-v1";

export default function JobPreferencesForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [experience, setExperience] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [salary, setSalary] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  function toggleEmploymentType(type) {
    setEmploymentTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("");

    const preferences = {
      jobTitle: jobTitle.trim(),
      location: location.trim(),
      employmentTypes,
      experience,
      workplace,
      salaryMin: salary.trim() === "" ? null : Number(salary),
      skills:
        skillsText.trim() === ""
          ? []
          : skillsText.split(",").map(normalizeSkill),
    };

    const validationErrors = validatePreferences(preferences);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences)
      );
      setNotice("Job preferences saved successfully.");
    } catch {
      setNotice("Unable to save preferences in this browser.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Job preferences form"
      className="mx-auto max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="job-title" className="block font-medium">
          Job title
        </label>
        <input
          id="job-title"
          className={inputClass}
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          aria-invalid={Boolean(errors.jobTitle)}
          aria-describedby={errors.jobTitle ? "job-title-error" : undefined}
        />
        {errors.jobTitle && (
          <p id="job-title-error" role="alert">
            {errors.jobTitle}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="font-medium">Employment type</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {EMPLOYMENT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={employmentTypes.includes(type)}
                onChange={() => toggleEmploymentType(type)}
              />
              {type}
            </label>
          ))}
        </div>
        {errors.employmentTypes && (
          <p role="alert">{errors.employmentTypes}</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="experience" className="block font-medium">
          Experience level
        </label>
        <select
          id="experience"
          className={inputClass}
          value={experience}
          onChange={(event) => setExperience(event.target.value)}
          aria-invalid={Boolean(errors.experience)}
        >
          <option value="">Select experience</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.experience && (
          <p role="alert">{errors.experience}</p>
        )}
      </div>

      <div>
        <label htmlFor="workplace" className="block font-medium">
          Work arrangement
        </label>
        <select
          id="workplace"
          className={inputClass}
          value={workplace}
          onChange={(event) => setWorkplace(event.target.value)}
          aria-invalid={Boolean(errors.workplace)}
        >
          <option value="">Select arrangement</option>
          {WORK_ARRANGEMENTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.workplace && (
          <p role="alert">{errors.workplace}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block font-medium">
          Preferred location
        </label>
        <input
          id="location"
          className={inputClass}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-invalid={Boolean(errors.location)}
          aria-describedby={errors.location ? "location-error" : undefined}
        />
        {errors.location && (
          <p id="location-error" role="alert">
            {errors.location}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="salary" className="block font-medium">
          Minimum salary (optional)
        </label>
        <input
          id="salary"
          type="number"
          className={inputClass}
          value={salary}
          onChange={(event) => setSalary(event.target.value)}
          aria-invalid={Boolean(errors.salary)}
        />
        {errors.salary && (
          <p role="alert">{errors.salary}</p>
        )}
      </div>

      <div>
        <label htmlFor="skills" className="block font-medium">
          Skills (optional, comma-separated, maximum 10)
        </label>
        <input
          id="skills"
          className={inputClass}
          value={skillsText}
          onChange={(event) => setSkillsText(event.target.value)}
          aria-invalid={Boolean(errors.skills)}
          placeholder="Python, React, SQL"
        />
        {errors.skills && (
          <p role="alert">{errors.skills}</p>
        )}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
      >
        Save preferences
      </button>

      {notice && (
        <p role="status" aria-live="polite">
          {notice}
        </p>
      )}
    </form>
  );
}
