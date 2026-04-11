import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/SehatSaathi/", // 🔥 VERY IMPORTANT for GitHub Pages

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },

  root: "./client",

  build: {
    outDir: "../dist", // 🔥 clean output (not dist/public)
    emptyOutDir: true,
  },
});