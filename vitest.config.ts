import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@/components": fileURLToPath(new URL("./src/layouts/components", import.meta.url)),
      "@/shortcodes": fileURLToPath(new URL("./src/layouts/shortcodes", import.meta.url)),
      "@/helpers": fileURLToPath(new URL("./src/layouts/helpers", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "node",
  },
});
