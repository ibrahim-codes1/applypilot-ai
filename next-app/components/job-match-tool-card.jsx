
export default function JobMatchToolCard({ part }) {
  const state = part.state;
  const input = part.input || {};

  // State 1: AI is generating tool input.
  if (state === "input-streaming") {
    return (
      <section
        role="status"
        className="my-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          <div>
            <p className="font-semibold text-indigo-800">
              Preparing job analysis
            </p>
            <p className="text-sm text-indigo-600">
              AI is identifying skills and job requirements...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // State 2: Input ready; server is processing it.
  if (state === "input-available") {
    return (
      <section
        role="status"
        className="my-3 rounded-2xl border border-amber-300 bg-amber-50 p-4"
      >
        <p className="font-semibold text-amber-900">
          Analyzing job requirements
        </p>
        <p className="mt-1 text-sm text-amber-800">
          {input.jobTitle || "Job Match"}
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Comparing {input.skills?.length ?? 0} skills against{" "}
          {input.requirements?.length ?? 0} requirements.
        </p>
        <div className="mt-3 h-1.5 animate-pulse rounded-full bg-amber-300" />
      </section>
    );
  }

  // State 3: Successful tool execution.
  if (state === "output-available") {
    const output = part.output || {};
    const score = Number.isFinite(output.score)
      ? Math.max(0, Math.min(100, output.score))
      : 0;

    const matched = Array.isArray(output.matchedSkills)
      ? output.matchedSkills
      : [];

    const missing = Array.isArray(output.missingSkills)
      ? output.missingSkills
      : [];

    return (
      <section
        aria-label="Job match analysis result"
        className="my-3 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm"
      >
        <div className="bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Analysis complete
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900">
              {output.jobTitle || "Job Match"}
            </h3>

            <span className="text-3xl font-bold text-emerald-700">
              {score}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-label="Skill match percentage"
            className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-emerald-800">
            {output.matchedCount ?? matched.length} of{" "}
            {output.totalRequirements ?? matched.length + missing.length} requirements matched
          </p>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Matched skills
            </h4>

            <div className="mt-2 flex flex-wrap gap-2">
              {matched.length ? matched.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                >
                  ✓ {skill}
                </span>
              )) : (
                <p className="text-sm text-slate-500">
                  No exact matches found.
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Missing skills
            </h4>

            <div className="mt-2 flex flex-wrap gap-2">
              {missing.length ? missing.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800"
                >
                  {skill}
                </span>
              )) : (
                <p className="text-sm text-slate-500">
                  All listed requirements matched.
                </p>
              )}
            </div>
          </div>

          <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">
            Exact skill-name matching only. This is not a prediction
            of hiring success.
          </p>
        </div>
      </section>
    );
  }

  // State 4: Tool execution failed.
  if (state === "output-error") {
    return (
      <section
        role="alert"
        className="my-3 rounded-2xl border-2 border-red-300 bg-red-50 p-4"
      >
        <p className="font-bold text-red-800">
          Job analysis failed
        </p>
        <p className="mt-1 text-sm text-red-700">
          We couldn't complete the skill comparison.
          Please review your input and try again.
        </p>
        <p className="mt-2 text-xs text-red-600">
          {part.errorText
            ? "The tool reported an execution error."
            : "No additional error details are available."}
        </p>
      </section>
    );
  }

  return null;
}
