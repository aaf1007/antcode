import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { build } from "vite";
import { fileURLToPath } from "node:url";

test("built HTML applies the saved theme before React and bundles local fonts without server code", async () => {
  const result = await build({ configFile: fileURLToPath(new URL("../../vite.config.ts", import.meta.url)), build: { write: false }, logLevel: "silent" });
  assert.ok(!Array.isArray(result) && "output" in result);
  const htmlAsset = result.output.find((entry) => entry.fileName === "index.html");
  assert.ok(htmlAsset?.type === "asset");
  const html = String(htmlAsset.source);
  const initializer = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(initializer, "the HTML must contain a synchronous theme initializer");
  assert.ok(html.indexOf(initializer[0]) < html.indexOf('type="module"'));

  const root = { dataset: {} as Record<string, string> };
  runInNewContext(initializer[1], {
    document: { documentElement: root },
    window: {
      matchMedia: () => ({ matches: false }),
      localStorage: { getItem: () => "dark" },
    },
  });
  assert.equal(root.dataset.theme, "dark");
  assert.ok(result.output.some((entry) => entry.fileName.endsWith(".woff2")));

  for (const entry of result.output) {
    if (entry.type === "chunk") {
      assert.doesNotMatch(entry.code, /DATABASE_URL|postgresql:\/\/|orm-postgres/);
      assert.ok(Object.keys(entry.modules).every((id) => !id.includes("/server/") && !id.includes("/database/")));
    }
  }
});
