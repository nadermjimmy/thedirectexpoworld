import { test, expect } from "@playwright/test";

test("immersive demo loads the 3D canvas and Meet panel", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByRole("heading", { name: /EMAAR/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Schedule Meet/i })).toBeVisible();
});

test("can schedule a meeting and see it listed", async ({ page }) => {
  await page.goto("/");
  await page
    .getByPlaceholder("alice@example.com, bob@example.com")
    .fill("nader@byitcorp.com");
  await page.getByRole("button", { name: /Schedule Meet/i }).click();

  // The new meeting should appear with a Google Meet link.
  await expect(page.getByRole("link", { name: /meet\.google\.com/i }).first()).toBeVisible();
});
