import assert from "node:assert/strict";
import { test } from "node:test";
import { serve } from "../helpers/http.ts";
import { stubRepository } from "../helpers/repository.ts";

process.env.NODE_ENV = "production";
const { default: app } = await import("../../src/app.ts");

test("production is API-only and does not serve frontend pages or assets", async (t) => {
  stubRepository(t);
  const request = await serve(t, app);
  for (const path of ["/", "/problem", "/problem/p_1", "/icon.svg", "/assets/missing.js"]) {
    const response = await request(path, { headers: { accept: "text/html" } });
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(await response.text(), /id="root"/);
  }
  const api = await request("/api/problem");
  assert.equal(api.status, 200);
  assert.deepEqual(await api.json(), { problems: [], nextCursor: null });
  const missing = await request("/api/missing");
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: "API route not found." });
});
