import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: {
    command: "pnpm --filter @immersive/web dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
