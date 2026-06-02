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
  build: {
    // Split the heavy 3D libraries into their own long-cached vendor chunk.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei", "@react-three/xr"],
        },
      },
    },
    // The remaining large chunks are @react-three/xr's VR-emulator room
    // environments — lazy chunks that never load at runtime (emulate: false).
    chunkSizeWarningLimit: 2500,
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
