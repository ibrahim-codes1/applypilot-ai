
import test from 'node:test';
import assert from 'node:assert/strict';

import { jobMatchTool } from '../lib/tools/job-match.js';

// Helper to execute the real server-side tool.
async function analyze(skills, requirements) {
  return jobMatchTool.execute({
    jobTitle: 'Flutter Developer',
    skills,
    requirements,
  });
}

test('50% match: 2 of 4 requirements', async () => {
  const result = await analyze(
    ['Flutter', 'Dart', 'Firebase'],
    ['Flutter', 'Dart', 'REST APIs', 'Widget Testing']
  );

  assert.equal(result.score, 50);
  assert.equal(result.matchedCount, 2);
  assert.deepEqual(result.matchedSkills, ['Flutter', 'Dart']);
  assert.deepEqual(result.missingSkills, [
    'REST APIs',
    'Widget Testing',
  ]);
});

test('100% match: all requirements met', async () => {
  const result = await analyze(
    ['Flutter', 'Dart', 'Firebase'],
    ['Flutter', 'Dart', 'Firebase']
  );

  assert.equal(result.score, 100);
  assert.equal(result.missingSkills.length, 0);
});

test('0% match: no matching skills', async () => {
  const result = await analyze(
    ['Python', 'Django'],
    ['Flutter', 'Dart']
  );

  assert.equal(result.score, 0);
  assert.equal(result.matchedCount, 0);
});

test('Duplicate and case-insensitive skills', async () => {
  const result = await analyze(
    [' flutter ', 'DART'],
    ['Flutter', 'FLUTTER', ' Dart ', 'Firebase']
  );

  assert.equal(result.totalRequirements, 3);
  assert.equal(result.matchedCount, 2);
  assert.equal(result.score, 67);
});

test('Zod rejects missing or empty skill lists', () => {
  const validation = jobMatchTool.inputSchema.safeParse({
    skills: [],
    requirements: ['Flutter'],
  });

  assert.equal(validation.success, false);
});
