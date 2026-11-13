
import { test, expect } from "@playwright/test";

test("user sends a message and receives a mocked AI reply", async ({ page }) => {
  let apiCalls = 0;

  // Intercept every chat request before opening the page.
  await page.route("**/api/chat", async (route) => {
    apiCalls += 1;

    const events = [
      { type: "start", messageId: "mock-assistant-1" },
      { type: "start-step" },
      { type: "text-start", id: "mock-text-1" },
      {
        type: "text-delta",
        id: "mock-text-1",
        delta: "Here are three interview preparation tips.",
      },
      { type: "text-end", id: "mock-text-1" },
      { type: "finish-step" },
      { type: "finish" },
    ];

    const body =
      events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("") +
      "data: [DONE]\n\n";

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      headers: {
        "x-vercel-ai-ui-message-stream": "v1",
        "cache-control": "no-cache",
      },
      body,
    });
  });

  // Open the real Next.js chat page.
  await page.goto("/chat");

  await expect(
    page.getByRole("heading", { name: "Career coach" })
  ).toBeVisible();

  const messageInput = page.getByRole("textbox", {
    name: "Your message",
  });

  await expect(messageInput).toBeEnabled();

  // Simulate a real user sending a message.
  await messageInput.fill("Help me prepare for an interview.");

  await page.getByRole("button", { name: /^Send/i }).click();

  const conversation = page.getByRole("log", {
    name: "Conversation",
  });

  // Verify the user's message appears.
  await expect(conversation).toContainText(
    "Help me prepare for an interview."
  );

  // Verify the mocked AI response appears.
  await expect(conversation).toContainText(
    "Here are three interview preparation tips."
  );

  // Verify exactly one mocked API request occurred.
  expect(apiCalls).toBe(1);

  // Verify chat returns to its ready state.
  await expect(
    page.getByText("Ready to chat", { exact: true })
  ).toBeVisible();
});
