import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "lib/validators.ts",
        "lib/formatters.ts",
        "lib/parcelas.ts",
        "lib/tributos.ts",
        "lib/debitos.ts",
        "lib/utils.ts",
        // lib/store.ts: testamos só os 3 helpers exportados (~50% cov);
        // re-incluir quando vier a leva de actions do store.
      ],
      exclude: ["lib/api.ts", "lib/**/*.test.ts", "**/*.d.ts"],
      thresholds: {
        lines: 90,
        functions: 95,
        branches: 85,
        statements: 90,
      },
    },
  },
});
