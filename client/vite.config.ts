import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { themeScript } from "./src/components/theme/theme.ts";

export default defineConfig(({ mode }) => {
  const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
  const env = loadEnv(mode, repositoryRoot, "");
  return {
    root: import.meta.dirname,
    envDir: repositoryRoot,
    plugins: [
      react(),
      {
        name: "antcode-theme",
        transformIndexHtml: () => [{
          tag: "script",
          children: themeScript,
          injectTo: "head-prepend" as const,
        }],
      },
    ],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      proxy: { "/api": `http://127.0.0.1:${env.API_PORT || 3001}` },
      fs: {
        allow: [import.meta.dirname, fileURLToPath(new URL("../node_modules", import.meta.url))],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/database/**", "**/server/**"],
      },
    },
    build: { outDir: "dist" },
  };
});
