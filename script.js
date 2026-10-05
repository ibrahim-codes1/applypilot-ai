const form = document.querySelector("#preferences-form");
const jobTitleInput = document.querySelector("#job-title");
const experienceSelect = document.querySelector("#experience");
const workplaceSelect = document.querySelector("#workplace");
const locationInput = document.querySelector("#location");
const locationOptionalLabel = document.querySelector("#location-optional");
const salaryMinInput = document.querySelector("#salary-min");
const salaryMaxInput = document.querySelector("#salary-max");
const skillInput = document.querySelector("#skill-input");
const skillTags = document.querySelector("#skill-tags");
const tagInputWrap = document.querySelector("#tag-input-wrap");
const feedback = document.querySelector("#form-feedback");

const skills = [];
const skillLimit = 10;

function restorePreferences() {
  try {
    const savedPreferences = window.localStorage.getItem("applypilot-job-preferences");
    if (!savedPreferences) return;

    const preferences = JSON.parse(savedPreferences);
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
    if (typeof preferences.salaryMax === "number" && Number.isFinite(preferences.salaryMax)) {
      salaryMaxInput.value = String(preferences.salaryMax);
    }

    if (Array.isArray(preferences.employmentTypes)) {
      const employmentTypes = new Set(preferences.employmentTypes);
      form.querySelectorAll('input[name="employmentType"]').forEach((input) => {
        input.checked = employmentTypes.has(input.value);
      });
    }

    if (Array.isArray(preferences.skills)) {
      preferences.skills
        .filter((skill) => typeof skill === "string" && skill.trim())
        .slice(0, skillLimit)
        .forEach((skill) => skills.push(skill.trim()));
      renderSkills();
    }

    updateLocationRequirement();
    feedback.textContent = "Your saved preferences are ready to update.";
  } catch (error) {
    console.error("Unable to load saved job preferences.", error);
    feedback.textContent = "We couldn’t load your saved preferences from this device.";
    feedback.setAttribute("role", "alert");
  }
}

function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function updateLocationRequirement() {
  const needsLocation = ["Hybrid", "On-site"].includes(workplaceSelect.value);
  locationInput.required = needsLocation;
  locationOptionalLabel.textContent = needsLocation ? "(required)" : "(optional)";
  document.querySelector("#location-hint").textContent = needsLocation
    ? "Add a city or region for hybrid and on-site roles."
    : "Remote roles can be anywhere.";
  if (!needsLocation || locationInput.value.trim()) {
    setFieldError(locationInput, document.querySelector("#location-error"), "");
  }
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
  const skill = skillInput.value.trim().replace(/,+$/, "").trim();
  if (!skill) {
    skillInput.value = "";
    return;
  }

  const alreadyAdded = skills.some((existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase());
  if (alreadyAdded) {
    document.querySelector("#skill-error").textContent = "That skill is already on your list.";
    skillInput.focus();
    return;
  }
  if (skills.length >= skillLimit) {
    document.querySelector("#skill-error").textContent = `You can add up to ${skillLimit} skills.`;
    skillInput.focus();
    return;
  }

  document.querySelector("#skill-error").textContent = "";
  skills.push(skill);
  skillInput.value = "";
  renderSkills();
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
workplaceSelect.addEventListener("change", updateLocationRequirement);

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select")) feedback.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.textContent = "";

  let firstInvalidField = null;
  const markInvalid = (input, errorElement, message) => {
    setFieldError(input, errorElement, message);
    if (message && !firstInvalidField) firstInvalidField = input;
  };

  const titleError = jobTitleInput.value.trim().length < 2
    ? "Enter a job title with at least 2 characters."
    : jobTitleInput.validity.tooLong ? "Keep the job title under 80 characters." : "";
  markInvalid(jobTitleInput, document.querySelector("#job-title-error"), titleError);

  const employmentTypes = [...form.querySelectorAll('input[name="employmentType"]:checked')]
    .map((input) => input.value);
  const employmentError = employmentTypes.length ? "" : "Choose at least one employment type.";
  document.querySelector("#employment-error").textContent = employmentError;
  if (employmentError && !firstInvalidField) firstInvalidField = form.querySelector('input[name="employmentType"]');

  markInvalid(
    experienceSelect,
    document.querySelector("#experience-error"),
    experienceSelect.value ? "" : "Select your experience level.",
  );
  markInvalid(
    workplaceSelect,
    document.querySelector("#workplace-error"),
    workplaceSelect.value ? "" : "Select your preferred work arrangement.",
  );

  updateLocationRequirement();
  const locationError = locationInput.required && !locationInput.value.trim()
    ? "Add a location for hybrid and on-site roles."
    : locationInput.validity.tooLong ? "Keep the location under 100 characters." : "";
  markInvalid(locationInput, document.querySelector("#location-error"), locationError);

  const salaryMin = salaryMinInput.value === "" ? null : Number(salaryMinInput.value);
  const salaryMax = salaryMaxInput.value === "" ? null : Number(salaryMaxInput.value);
  let salaryError = "";
  if (salaryMinInput.validity.badInput || salaryMaxInput.validity.badInput
    || salaryMinInput.validity.rangeOverflow || salaryMaxInput.validity.rangeOverflow
    || salaryMinInput.validity.rangeUnderflow || salaryMaxInput.validity.rangeUnderflow) {
    salaryError = "Enter a salary between $0 and $99,999,999.";
  } else if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    salaryError = "Your minimum salary can’t be higher than your maximum.";
  }
  document.querySelector("#salary-error").textContent = salaryError;
  salaryMinInput.setAttribute("aria-invalid", salaryError ? "true" : "false");
  salaryMaxInput.setAttribute("aria-invalid", salaryError ? "true" : "false");
  if (salaryError && !firstInvalidField) firstInvalidField = salaryMinInput;

  if (firstInvalidField) {
    firstInvalidField.focus();
    return;
  }

  const preferences = {
    jobTitle: jobTitleInput.value.trim(),
    employmentTypes,
    experience: experienceSelect.value,
    workplace: workplaceSelect.value,
    location: locationInput.value.trim(),
    salaryMin,
    salaryMax,
    skills: [...skills],
    savedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem("applypilot-job-preferences", JSON.stringify(preferences));
    feedback.textContent = "Your preferences are saved on this device. You’re ready to find your next role.";
  } catch (error) {
    console.error("Unable to save job preferences.", error);
    feedback.textContent = "We couldn’t save your preferences on this device. Please check your browser’s storage settings and try again.";
    feedback.setAttribute("role", "alert");
  }
});

updateLocationRequirement();
restorePreferences();
