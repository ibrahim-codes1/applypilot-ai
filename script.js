const { MAX_SKILLS, normalizeSkill, validatePreferences } = window.ApplyPilotPreferences;

const form = document.querySelector("#preferences-form");
const jobTitleInput = document.querySelector("#job-title");
const experienceSelect = document.querySelector("#experience");
const workplaceSelect = document.querySelector("#workplace");
const locationInput = document.querySelector("#location");
const salaryMinInput = document.querySelector("#salary-min");
const skillInput = document.querySelector("#skill-input");
const skillTags = document.querySelector("#skill-tags");
const feedback = document.querySelector("#form-feedback");
const skills = [];

function setFieldError(input, errorElement, message) {
  errorElement.textContent = message ?? "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function renderSkills() {
  skillTags.replaceChildren();
  skills.forEach((skill, index) => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.append(document.createTextNode(skill));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${skill}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      skills.splice(index, 1);
      renderSkills();
      skillInput.focus();
    });
    tag.append(removeButton);
    skillTags.append(tag);
  });
}

function addSkill() {
  const skill = normalizeSkill(skillInput.value);
  const error = document.querySelector("#skill-error");
  if (!skill) {
    skillInput.value = "";
    return;
  }
  if (skills.some((existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase())) {
    error.textContent = "That skill is already on your list.";
    skillInput.value = "";
    return;
  }
  if (skills.length >= MAX_SKILLS) {
    error.textContent = `You can add up to ${MAX_SKILLS} skills.`;
    skillInput.value = "";
    return;
  }

  error.textContent = "";
  skills.push(skill);
  skillInput.value = "";
  renderSkills();
}

function collectPreferences() {
  const salaryMin = salaryMinInput.validity.badInput
    ? Number.NaN
    : salaryMinInput.value === "" ? null : Number(salaryMinInput.value);
  return {
    jobTitle: jobTitleInput.value.trim(),
    employmentTypes: [...form.querySelectorAll('input[name="employmentType"]:checked')]
      .map((input) => input.value),
    experience: experienceSelect.value,
    workplace: workplaceSelect.value,
    location: locationInput.value.trim(),
    salaryMin,
    skills: [...skills],
  };
}

function showErrors(errors) {
  const fieldTargets = {
    jobTitle: [jobTitleInput, "#job-title-error"],
    experience: [experienceSelect, "#experience-error"],
    workplace: [workplaceSelect, "#workplace-error"],
    location: [locationInput, "#location-error"],
  };
  let firstInvalidField = null;

  for (const [name, [input, errorSelector]] of Object.entries(fieldTargets)) {
    const message = errors[name] ?? "";
    setFieldError(input, document.querySelector(errorSelector), message);
    if (message && !firstInvalidField) firstInvalidField = input;
  }

  const employmentError = errors.employmentTypes ?? "";
  document.querySelector("#employment-error").textContent = employmentError;
  form.querySelectorAll('input[name="employmentType"]').forEach((input) => {
    input.setAttribute("aria-invalid", employmentError ? "true" : "false");
  });
  if (employmentError && !firstInvalidField) {
    firstInvalidField = form.querySelector('input[name="employmentType"]');
  }

  const salaryError = errors.salary ?? "";
  document.querySelector("#salary-error").textContent = salaryError;
  salaryMinInput.setAttribute("aria-invalid", salaryError ? "true" : "false");
  if (salaryError && !firstInvalidField) firstInvalidField = salaryMinInput;
  document.querySelector("#skill-error").textContent = errors.skills ?? "";
  if (firstInvalidField) firstInvalidField.focus();
  if (firstInvalidField) firstInvalidField.focus();
}

function restorePreferences() {
  try {
    const saved = window.localStorage.getItem("applypilot-job-preferences");
    if (!saved) return;
    const preferences = JSON.parse(saved);
    if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
      throw new Error("Saved job preferences are not a valid object.");
    }

    if (typeof preferences.jobTitle === "string") jobTitleInput.value = preferences.jobTitle;
    if (typeof preferences.experience === "string") experienceSelect.value = preferences.experience;
    if (typeof preferences.workplace === "string") workplaceSelect.value = preferences.workplace;
    if (typeof preferences.location === "string") locationInput.value = preferences.location;
    if (typeof preferences.salaryMin === "number" && Number.isFinite(preferences.salaryMin)) {
      salaryMinInput.value = String(preferences.salaryMin);
    }
    if (Array.isArray(preferences.employmentTypes)) {
      const selectedTypes = new Set(preferences.employmentTypes);
      form.querySelectorAll('input[name="employmentType"]').forEach((input) => {
        input.checked = selectedTypes.has(input.value);
      });
    }
    if (Array.isArray(preferences.skills)) {
      preferences.skills.filter((skill) => typeof skill === "string" && skill.trim())
        .slice(0, MAX_SKILLS).forEach((skill) => skills.push(skill.trim()));
      renderSkills();
    }

    feedback.textContent = "Your saved preferences are ready to update.";
  } catch (error) {
    console.error("Unable to load saved job preferences.", error);
    feedback.textContent = "We couldn’t load your saved preferences from this device.";
    feedback.setAttribute("role", "alert");
  }
}

skillInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    addSkill();
  }
});
skillInput.addEventListener("blur", () => {
  if (skillInput.value.trim()) addSkill();
});
skillInput.addEventListener("input", () => {
  document.querySelector("#skill-error").textContent = "";
});
form.addEventListener("input", (event) => {
  if (event.target.matches("input, select")) feedback.textContent = "";
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.textContent = "";
  const preferences = collectPreferences();
  const errors = validatePreferences(preferences);
  showErrors(errors);
  if (Object.keys(errors).length > 0) return;

  try {
    window.localStorage.setItem("applypilot-job-preferences", JSON.stringify({
      ...preferences,
      savedAt: new Date().toISOString(),
    }));
    feedback.textContent = "Your preferences are saved on this device. You’re ready to find your next role.";
  } catch (error) {
    console.error("Unable to save job preferences.", error);
    feedback.textContent = "We couldn’t save your preferences on this device. Please check your browser’s storage settings and try again.";
    feedback.setAttribute("role", "alert");
  }
});

restorePreferences();
