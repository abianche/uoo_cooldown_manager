import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/uoo_cooldown_manager/",
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false,
    },
    outDir: "dist",
    sourcemap: false,
  },
});
