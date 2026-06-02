import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@immersive/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@immersive/meet": path.resolve(__dirname, "../../packages/meet/src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
});
