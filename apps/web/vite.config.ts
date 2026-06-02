import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@immersive/shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the NestJS server during local dev.
      "/meetings": "http://localhost:3001",
      "/health": "http://localhost:3001",
    },
  },
});
