import { test, expect } from "@playwright/test";

test("homepage loads the 3D canvas", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
});
