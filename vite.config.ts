import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: path.resolve(import.meta.dirname, "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});