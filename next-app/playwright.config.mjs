
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.js",
  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev -- --hostname localhost --port 3100",
    url: "http://localhost:3100/chat",
    reuseExistingServer: false,
    timeout: 120000,

    env: {
      AI_PROVIDER: "google",
      GOOGLE_GENERATIVE_AI_API_KEY: "playwright-test-only",
    },
  },
});
