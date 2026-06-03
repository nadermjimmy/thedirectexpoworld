import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: ".",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    // Force software WebGL so the 3D scene renders in headless CI — booth
    // picking in the specs relies on real rendered geometry.
    launchOptions: {
      args: ["--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
    },
  },
  webServer: {
    // Build and run the real deployable artifact: NestJS serving the
    // immersive web app + meetings API on a single port (as on Railway).
    command: `pnpm run build && PORT=${PORT} node apps/api/dist/main.js`,
    cwd: process.cwd(),
    port: PORT,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
