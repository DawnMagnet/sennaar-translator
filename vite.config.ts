import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "./",
  build: { target: "es2022" },
  test: { include: ["src/**/*.test.ts"] },
  lint: { ignorePatterns: ["dist/**", "third_party/**"] },
  fmt: { ignorePatterns: ["dist/**", "third_party/**", "src/data/*.json"] },
});
