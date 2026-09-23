import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import type { ProblemItem, ProblemListItem } from "../../src/types/problem.types.ts";
import { serve } from "../helpers/http.ts";
import { stubCatalog } from "../helpers/catalog.ts";

const { default: app } = await import("../../src/app.ts");

async function setup(t: TestContext, overrides: Parameters<typeof stubCatalog>[1] = {}) {
  stubCatalog(t, {
    listProblems: async () => ({ problems: [listItem], nextCursor: null }),
    findProblem: async () => problemItem,
    findWorkbench: async () => workbench,
    ...overrides,
  });
  t.mock.method(console, "error", () => {});
  return serve(t, app);
}

const listItem: ProblemListItem = {
  problemId: "p_1",
  slug: "two-sum",
  frontendId: 1,
  title: "Two Sum",
  url: "https://leetcode.com/problems/two-sum/",
  difficulty: "Easy",
  category: "Algorithms",
  isPremium: false,
  acRate: 56.4,
};

const workbench = {
  availability: "ready" as const,
  languages: [
    { slug: "python3" as const, name: "Python 3", starterCode: "class Solution:" },
    { slug: "javascript" as const, name: "JavaScript", starterCode: "var twoSum = function() {};" },
    { slug: "java" as const, name: "Java", starterCode: "class Solution {}" },
  ],
  testCases: [{ index: 0, input: "[2,7,11,15]\\n9", expected: "[0,1]" }],
};

const problemItem: ProblemItem = {
  ...listItem,
  slug: "two-sum",
  contentText: "Given an array of integers...",
  exampleInputFirst: "[2,7,11,15]",
  likes: 100,
  dislikes: 10,
  totalAccepted: 1000,
  totalSubmitted: 2000,
};

test("GET /api/problem passes the first cursor value to the catalog", async (t) => {
  let received: unknown;
  const request = await setup(t, {
    listProblems: async (cursor) => {
      received = cursor;
      return { problems: [listItem], nextCursor: null };
    },
  });

  const response = await request("/api/problem?after=10&after=20");

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { problems: [listItem], nextCursor: null });
  assert.equal(received, "10");
});

test("GET /api/problem returns a generic 500 on catalog failure", async (t) => {
  const request = await setup(t, {
    listProblems: async () => { throw new Error("private database details"); },
  });
  const response = await request("/api/problem");
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Internal server error." });
});

test("GET /api/problem/:slug returns a problem and decodes its slug", async (t) => {
  let received: unknown;
  const request = await setup(t, {
    findProblem: async (id) => { received = id; return problemItem; },
  });
  const response = await request("/api/problem/two%20sum");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { problem: problemItem, workbench });
  assert.equal(received, "two sum");
});

test("GET /api/problem/:slug returns 404 for a missing problem", async (t) => {
  const request = await setup(t, { findProblem: async () => null });
  const response = await request("/api/problem/missing");
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Problem not found." });
});

test("GET /api/problem/:slug returns a generic 500 on catalog failure", async (t) => {
  const request = await setup(t, {
    findProblem: async () => { throw new Error("private database details"); },
  });
  const response = await request("/api/problem/two-sum");
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Internal server error." });
});

test("GET /api/problem/ continues to resolve to the collection", async (t) => {
  const request = await setup(t);
  assert.equal((await request("/api/problem/")).status, 200);
});

test("unknown API routes return JSON 404", async (t) => {
  const request = await setup(t);
  const response = await request("/api/missing", { headers: { accept: "text/html" } });
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "API route not found." });
});

test("frontend routes are unavailable on the API server", async (t) => {
  const request = await setup(t);
  const response = await request("/problem/two-sum", { headers: { accept: "text/html" } });
  assert.equal(response.status, 404);
});

for (const path of ["/api/problem", "/api/problem/two-sum"]) {
  test(`${path} supports HEAD/OPTIONS and rejects unsupported methods`, async (t) => {
    const request = await setup(t);
    const head = await request(path, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const options = await request(path, { method: "OPTIONS" });
    assert.equal(options.status, 204);
    assert.equal(options.headers.get("allow"), "GET, HEAD, OPTIONS");
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const response = await request(path, { method });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), "GET, HEAD, OPTIONS");
      assert.deepEqual(await response.json(), { error: "Method not allowed." });
    }
  });
}

test("malformed URL parameters return JSON 400", async (t) => {
  const request = await setup(t);
  const response = await request("/api/problem/%E0%A4%A");
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

test("malformed JSON returns JSON 400 without exposing parser details", async (t) => {
  const request = await setup(t);
  const response = await request("/api/problem", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"private":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

test("oversized JSON returns JSON 413 without exposing parser details", async (t) => {
  const request = await setup(t);
  const response = await request("/api/problem", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ private: "x".repeat(100 * 1024) }),
  });
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

test("JSON with an unsupported charset returns a generic JSON 415", async (t) => {
  const request = await setup(t);
  const response = await request("/api/problem", {
    method: "POST",
    headers: { "content-type": "application/json; charset=iso-8859-1" },
    body: '{"private":"details"}',
  });
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

test("JSON with an unsupported content encoding returns a generic JSON 415", async (t) => {
  const request = await setup(t);
  const response = await request("/api/problem", {
    method: "POST",
    headers: { "content-type": "application/json", "content-encoding": "unsupported" },
    body: '{"private":"details"}',
  });
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

for (const status of [400, undefined]) {
  test(`unrecognized catalog errors with status ${status} remain generic JSON 500`, async (t) => {
    const request = await setup(t, {
      listProblems: async () => {
        throw Object.assign(new Error("private database details"), {
          status,
          type: "database.query.failed",
        });
      },
    });
    const response = await request("/api/problem");
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Internal server error." });
  });
}
