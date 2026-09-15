import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  globalIgnores([
    "**/dist/**", ".next/**", "next-env.d.ts",
    ".agents/**", ".claude/**", ".cursor/**", ".devin/**", ".playwright-mcp/**",
    "server/src/db/migrations/**", "server/src/db/prisma/contract.d.ts",
  ]),
  {
    files: ["**/*.{ts,tsx,mjs}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["client/src/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": ["error", {
        patterns: [
          { group: ["**/server/**"], allowTypeImports: true, message: "Only erased API types belong in client code." },
          { group: ["@prisma/*", "pg", "dotenv", "dotenv/*", "node:*"], message: "Keep server runtime code in server/." },
        ],
      }],
    },
  },
  {
    files: ["server/src/db/seed/problems.ts"],
    // The existing dynamic seed builder uses Prisma's untyped SQL surface.
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
]);
