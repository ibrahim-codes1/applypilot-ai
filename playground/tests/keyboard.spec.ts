import { test, expect } from "@playwright/test";

test("dialog traps forward and reverse focus and returns it after Escape", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: /open hand-built modal/i });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: /save a quick note/i });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(page.getByRole("textbox", { name: "Note title" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Save note" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("dialog makes background inert while open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /open hand-built modal/i }).click();
  await expect(page.locator("#root")).toHaveJSProperty("inert", true);
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("#root")).toHaveJSProperty("inert", false);
});

test("tabs support arrow wrapping, Home, End, and roving tabIndex", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("tablist", { name: "ARIA pattern concepts" });
  const tabs = list.getByRole("tab");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel", { name: "ARIA map" })).toBeFocused();
});

test("disclosure toggles with Enter and Space", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /what makes a disclosure accessible/i });
  await trigger.focus();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/a native/i)).toBeVisible();
  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText(/a native/i)).toBeHidden();
});

test("375px and 1280px viewports avoid horizontal overflow", async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /good interfaces work/i })).toBeVisible();
    const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflowing).toBe(false);
  }
});
