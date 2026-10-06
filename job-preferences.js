(() => {
const MAX_SKILLS = 10;

const employmentTypes = new Set(["Full-time", "Part-time", "Contract", "Internship"]);
const experienceLevels = new Set(["Entry level", "Mid-level", "Senior", "Lead / Manager", "Executive"]);
const workArrangements = new Set(["No preference", "Remote", "Hybrid", "On-site"]);

function normalizeSkill(value) {
  return value.trim().replace(/,+$/, "").trim();
}

function validatePreferences(preferences) {
  const errors = {};
  const jobTitle = typeof preferences.jobTitle === "string" ? preferences.jobTitle.trim() : "";

  if (jobTitle.length < 2) {
    errors.jobTitle = "Enter a job title with at least 2 characters.";
  } else if (jobTitle.length > 80) {
    errors.jobTitle = "Keep the job title under 80 characters.";
  }

  if (!Array.isArray(preferences.employmentTypes)
    || !preferences.employmentTypes.length
    || preferences.employmentTypes.some((type) => !employmentTypes.has(type))) {
    errors.employmentTypes = "Choose at least one valid employment type.";
  }

  if (!experienceLevels.has(preferences.experience)) {
    errors.experience = "Select your experience level.";
  }

  if (!workArrangements.has(preferences.workplace)) {
    errors.workplace = "Select your preferred work arrangement.";
  }

  const location = typeof preferences.location === "string" ? preferences.location.trim() : "";
  if (!location) {
    errors.location = "Enter a preferred location.";
  } else if (location.length > 100) {
    errors.location = "Keep the location under 100 characters.";
  }

  const salaryMin = preferences.salaryMin;
  if (salaryMin !== null && salaryMin !== undefined
    && (!Number.isFinite(salaryMin) || salaryMin <= 0)) {
    errors.salary = "Enter a minimum salary greater than $0.";
  }

  if (!Array.isArray(preferences.skills) || preferences.skills.length > MAX_SKILLS
    || preferences.skills.some((skill) => typeof skill !== "string" || !skill.trim())) {
    errors.skills = `Add no more than ${MAX_SKILLS} non-empty skills.`;
  }

  return errors;
}

window.ApplyPilotPreferences = Object.freeze({ MAX_SKILLS, normalizeSkill, validatePreferences });
})();
