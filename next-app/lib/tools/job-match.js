
import { tool } from "ai";
import { z } from "zod";

const skillList = z
  .array(z.string().trim().min(1).max(60))
  .min(1)
  .max(20);

export const jobMatchTool = tool({
  description:
    "Compare a user's stated skills with a job's stated requirements. " +
    "Only call when both lists are provided. Do not invent skills or requirements.",

  inputSchema: z.object({
    jobTitle: z.string().trim().min(2).max(80).optional()
      .describe("Optional job title"),

    skills: skillList.describe("Skills explicitly provided by the user"),

    requirements: skillList.describe("Requirements explicitly provided for the job"),
  }),

  execute: async ({ jobTitle, skills, requirements }) => {
    const normalize = (value) =>
      value.trim().toLowerCase().replace(/\s+/g, " ");

    const uniqueRequirements = [
      ...new Map(requirements.map((r) => [normalize(r), r])).values(),
    ];

    const userSkills = new Set(skills.map(normalize));

    const matchedSkills = uniqueRequirements.filter((r) =>
      userSkills.has(normalize(r))
    );

    const missingSkills = uniqueRequirements.filter((r) =>
      !userSkills.has(normalize(r))
    );

    const score = Math.round(
      (matchedSkills.length / uniqueRequirements.length) * 100
    );

  return {
  jobTitle: jobTitle || "Job Match",
  score,
  matchedSkills,
  missingSkills,
  matchedCount: matchedSkills.length,
  totalRequirements: uniqueRequirements.length,
  method: "Exact skill-name matching, case-insensitive",
  };

  },
});
