const { MAX_SKILLS, normalizeSkill, validatePreferences } = window.ApplyPilotPreferences;

const results = document.querySelector("#results");
const summary = document.querySelector("#summary");
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function test(name, callback) {
  const item = document.createElement("li");
  try {
    callback();
    item.className = "pass";
    item.textContent = `PASS ${name}`;
    passed += 1;
  } catch (error) {
    item.className = "fail";
    item.textContent = `FAIL ${name}: ${error.message}`;
    failed += 1;
  }
  results.append(item);
}

function validPreferences(overrides = {}) {
  return {
    jobTitle: "Product Designer",
    employmentTypes: ["Full-time"],
    experience: "Mid-level",
    workplace: "Remote",
    location: "Toronto",
    salaryMin: null,
    skills: [],
    ...overrides,
  };
}

test("accepts valid preferences with optional salary and skills omitted", () => {
  assert(Object.keys(validatePreferences(validPreferences())).length === 0, "Valid preferences were rejected.");
});

test("requires a job title with at least two characters", () => {
  assert(Boolean(validatePreferences(validPreferences({ jobTitle: " " })).jobTitle), "Blank title was accepted.");
  assert(!validatePreferences(validPreferences({ jobTitle: "UX" })).jobTitle, "Valid title was rejected.");
});

test("requires at least one supported employment type", () => {
  assert(Boolean(validatePreferences(validPreferences({ employmentTypes: [] })).employmentTypes), "Empty selection was accepted.");
  assert(Boolean(validatePreferences(validPreferences({ employmentTypes: ["Permanent"] })).employmentTypes), "Unsupported type was accepted.");
  assert(!validatePreferences(validPreferences({ employmentTypes: ["Contract", "Part-time"] })).employmentTypes, "Valid selections were rejected.");
});

test("requires supported experience and work arrangement values", () => {
  const errors = validatePreferences(validPreferences({ experience: "", workplace: "Flexible" }));
  assert(Boolean(errors.experience) && Boolean(errors.workplace), "Invalid selections were accepted.");
});

test("requires a non-empty location for every work arrangement", () => {
  assert(Boolean(validatePreferences(validPreferences({ location: "" })).location), "Missing location was accepted.");
  assert(Boolean(validatePreferences(validPreferences({ location: "   " })).location), "Whitespace-only location was accepted.");
  for (const workplace of ["No preference", "Remote", "Hybrid", "On-site"]) {
    assert(!validatePreferences(validPreferences({ workplace, location: "Toronto" })).location, `${workplace} role with location was rejected.`);
  }
});

test("allows an empty or positive minimum salary and rejects invalid amounts", () => {
  assert(!validatePreferences(validPreferences({ salaryMin: null })).salary, "An empty salary was rejected.");
  assert(!validatePreferences(validPreferences({ salaryMin: 50000 })).salary, "A positive salary was rejected.");
  assert(Boolean(validatePreferences(validPreferences({ salaryMin: 0 })).salary), "Zero salary was accepted.");
  assert(Boolean(validatePreferences(validPreferences({ salaryMin: -1 })).salary), "Negative salary was accepted.");
  assert(Boolean(validatePreferences(validPreferences({ salaryMin: Number.NaN })).salary), "Non-finite salary was accepted.");
  assert(Boolean(validatePreferences(validPreferences({ salaryMin: "invalid" })).salary), "Invalid numeric input was accepted.");
});

test("normalizes skill whitespace and trailing separators", () => {
  assert(normalizeSkill("  Figma,  ") === "Figma", "Skill was not normalized.");
  assert(normalizeSkill("   ") === "", "Empty skill was not normalized.");
});

test("allows up to ten non-empty skills", () => {
  const skills = Array.from({ length: MAX_SKILLS }, (_, index) => `Skill ${index + 1}`);
  assert(!validatePreferences(validPreferences({ skills })).skills, "Valid skill list was rejected.");
  assert(Boolean(validatePreferences(validPreferences({ skills: [...skills, "Extra"] })).skills), "Too many skills were accepted.");
});

async function testFormSubmissionBlocksInvalidPreferences() {
  const frame = document.querySelector("#form-fixture");
  assert(frame, "The form test fixture iframe is missing.");
  let frameDocument = frame.contentDocument;
  if (!frameDocument || frameDocument.readyState !== "complete") {
    frameDocument = await new Promise((resolve) => {
      frame.addEventListener("load", () => resolve(frame.contentDocument), { once: true });
    });
  }
  assert(frameDocument, "The form test fixture did not load an accessible document.");

  const frameWindow = frame.contentWindow;
  frameWindow.localStorage.removeItem("applypilot-job-preferences");
  const reloadedDocumentPromise = new Promise((resolve) => {
    frame.addEventListener("load", () => resolve(frame.contentDocument), { once: true });
  });
  frameWindow.location.reload();
  frameDocument = await reloadedDocumentPromise;
  assert(frameDocument, "The form test fixture did not provide a document after reloading.");
  frameDocument.querySelector("#preferences-form button[type=submit]").click();

  assert(
    frameDocument.querySelector("#form-feedback").textContent.trim() === "",
    "Invalid empty submission displayed a success message.",
  );
  assert(
    frameWindow.localStorage.getItem("applypilot-job-preferences") === null,
    "Invalid empty submission wrote preferences to storage.",
  );

  for (const [inputSelector, errorSelector] of [
    ["#job-title", "#job-title-error"],
    ["#experience", "#experience-error"],
    ["#workplace", "#workplace-error"],
    ["#location", "#location-error"],
  ]) {
    const input = frameDocument.querySelector(inputSelector);
    const error = frameDocument.querySelector(errorSelector);
    assert(error.textContent.trim(), `${inputSelector} did not show a field-level error.`);
    assert(input.getAttribute("aria-invalid") === "true", `${inputSelector} is not marked invalid.`);
    assert(input.getAttribute("aria-describedby").split(/\s+/).includes(error.id), `${inputSelector} is not associated with its error.`);
  }

  const employmentFieldset = frameDocument.querySelector('fieldset[aria-describedby="employment-error"]');
  const employmentError = frameDocument.querySelector("#employment-error");
  assert(employmentError.textContent.trim(), "Employment type did not show a field-level error.");
  assert(employmentFieldset.querySelector('input[type="checkbox"]').getAttribute("aria-invalid") === "true", "Employment type options are not marked invalid.");
  assert(
    frameWindow.localStorage.getItem("applypilot-job-preferences") === null,
    "Invalid form submission reached persistence after displaying its errors.",
  );

  frameDocument.querySelector("#job-title").value = "Product Designer";
  frameDocument.querySelector('input[name="employmentType"][value="Full-time"]').checked = true;
  frameDocument.querySelector("#experience").value = "Mid-level";
  frameDocument.querySelector("#workplace").value = "Remote";
  const locationInput = frameDocument.querySelector("#location");
  const locationError = frameDocument.querySelector("#location-error");
  assert(locationInput.required, "Location is not marked as required.");
  const salaryInputs = frameDocument.querySelectorAll('input[name="salaryMin"], input[name="salaryMax"]');
  const salaryInput = frameDocument.querySelector("#salary-min");
  const salaryError = frameDocument.querySelector("#salary-error");
  assert(salaryInputs.length === 1, "The form must contain exactly one minimum salary input.");
  assert(salaryInput.labels.length === 1 && salaryInput.labels[0].textContent.includes("Minimum Salary"), "Minimum salary input has no matching accessible label.");

  for (const value of ["", "   "]) {
    locationInput.value = value;
    frameDocument.querySelector("#preferences-form button[type=submit]").click();
    assert(locationError.textContent.trim(), "Invalid location did not show a field-level error.");
    assert(locationInput.getAttribute("aria-invalid") === "true", "Invalid location is not marked invalid.");
    assert(
      locationInput.getAttribute("aria-describedby").trim() === locationError.id,
      "Location must describe only its single validation error.",
    );
    assert(
      frameDocument.querySelectorAll("#location-error").length === 1
        && frameDocument.querySelector("#location-error").textContent.trim() === "Enter a preferred location.",
      "Location rendered more than one validation message.",
    );
    assert(
      frameWindow.localStorage.getItem("applypilot-job-preferences") === null,
      "Invalid location submission wrote preferences to storage.",
    );
  }

  locationInput.value = "Toronto";
  for (const value of ["0", "-1"]) {
    salaryInput.value = value;
    frameDocument.querySelector("#preferences-form button[type=submit]").click();
    assert(salaryError.textContent.trim(), `Salary ${value} did not show a field-level error.`);
    assert(salaryInput.getAttribute("aria-invalid") === "true", `Salary ${value} is not marked invalid.`);
    assert(
      salaryInput.getAttribute("aria-describedby").trim() === salaryError.id,
      "Minimum salary must describe only its single validation error.",
    );
    assert(frameDocument.querySelectorAll("#salary-error").length === 1, "More than one salary error was rendered.");
    assert(frameWindow.localStorage.getItem("applypilot-job-preferences") === null, `Salary ${value} was saved despite its validation error.`);
  }

  salaryInput.value = "50000";
  frameDocument.querySelector("#preferences-form button[type=submit]").click();
  assert(!locationError.textContent.trim(), "Valid location still showed a field-level error.");
  assert(locationInput.getAttribute("aria-invalid") === "false", "Valid location is still marked invalid.");
  assert(!salaryError.textContent.trim(), "Valid minimum salary still showed a field-level error.");
  assert(salaryInput.getAttribute("aria-invalid") === "false", "Valid minimum salary is still marked invalid.");
  assert(
    frameDocument.querySelector("#form-feedback").textContent.includes("Your preferences are saved"),
    "Valid preferences did not show the save confirmation.",
  );
  assert(
    JSON.parse(frameWindow.localStorage.getItem("applypilot-job-preferences")).salaryMin === 50000,
    "Valid minimum salary was not persisted.",
  );
  frameWindow.localStorage.removeItem("applypilot-job-preferences");
}

async function finishTests() {
  try {
    await testFormSubmissionBlocksInvalidPreferences();
    const item = document.createElement("li");
    item.className = "pass";
    item.textContent = "PASS blocks invalid submissions, announces required field errors, and saves a valid location";
    results.append(item);
    passed += 1;
  } catch (error) {
    const item = document.createElement("li");
    item.className = "fail";
    item.textContent = `FAIL form submission integration: ${error.message}`;
    results.append(item);
    failed += 1;
  }

  summary.textContent = `${passed} passed, ${failed} failed`;
  summary.className = failed ? "fail" : "pass";
}

finishTests();
