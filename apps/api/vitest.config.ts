import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        // テスト用のD1データベース設定
        d1Databases: ["DB"],
      },
    }),
  ],
  test: {
    include: ["src/spec/**/*.spec.ts"],
    setupFiles: ["./src/spec/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/services/**/*.ts", "src/routes/**/*.ts"],
      exclude: ["src/spec/**"],
    },
  },
});
