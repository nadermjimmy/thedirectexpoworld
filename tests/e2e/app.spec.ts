import { test, expect, type Page } from "@playwright/test";

/**
 * Open a booth's details panel by clicking the 3D canvas. Booth meshes are
 * scattered across the lower portion of the view, so we sweep a grid of points
 * until the floating panel slides open — robust to exact camera framing.
 */
async function openABooth(page: Page) {
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas has no bounding box");

  const panelOpen = page.locator(".booth-panel.is-open");
  for (let gy = 0.4; gy <= 0.9; gy += 0.05) {
    for (let gx = 0.1; gx <= 0.85; gx += 0.05) {
      await page.mouse.click(box.x + box.width * gx, box.y + box.height * gy);
      if (await panelOpen.count()) return;
      await page.waitForTimeout(120);
    }
  }
  throw new Error("no booth was hit while sweeping the canvas");
}

test("loads the 3D canvas with the booth panel closed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  // The floating panel exists but is not open until a booth is clicked.
  await expect(page.locator(".booth-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".booth-panel.is-open")).toHaveCount(0);
});

test("clicking a booth slides in a non-blocking details panel", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(4000); // let the WebGL scene render before picking

  await openABooth(page);

  const panel = page.locator(".booth-panel.is-open");
  await expect(panel).toBeVisible();
  await expect(panel.locator(".bp-name")).not.toBeEmpty();
  await expect(panel.locator(".bp-tile")).toHaveCount(4); // gallery
  await expect(panel.getByRole("button", { name: /Schedule Google Meet/i })).toBeVisible();

  // The scene is never covered: the canvas stays visible alongside the panel.
  await expect(page.locator("canvas")).toBeVisible();

  // Close button slides it back out.
  await panel.locator(".bp-close").click();
  await expect(page.locator(".booth-panel.is-open")).toHaveCount(0);
});

test("can schedule a Google Meet from the panel", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(4000);

  await openABooth(page);
  await page.getByRole("button", { name: /Schedule Google Meet/i }).click();

  await page.getByPlaceholder("alice@example.com, bob@example.com").fill("nader@byitcorp.com");
  await page.getByRole("button", { name: /Schedule Meet/i }).click();

  await expect(
    page.getByRole("link", { name: /meet\.google\.com/i }).first(),
  ).toBeVisible();
});
