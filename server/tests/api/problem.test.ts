import type { ProblemItem, ProblemListItem } from "../../src/types/problem.types.ts";
import { serve } from "../helpers/http.ts";
import { stubRepository } from "../helpers/repository.ts";
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

const { default: app } = await import("../../src/app.ts");

async function setup(t: TestContext, overrides: Parameters<typeof stubRepository>[1] = {}) {
  stubRepository(t, {
    getProblemPage: async () => [listItem],
    getProblemItem: async () => problemItem,
    ...overrides,
  });
  t.mock.method(console, "error", () => {});
  return serve(t, app);
}

const listItem: ProblemListItem = {
  problemId: "two-sum",
  frontendId: 1,
  title: "Two Sum",
  url: "https://leetcode.com/problems/two-sum/",
  difficulty: "Easy",
  category: "Algorithms",
  isPremium: false,
  acRate: 56.4,
};

const problemItem: ProblemItem = {
  ...listItem,
  questionId: 1,
  slug: "two-sum",
  contentHtml: null,
  contentText: "Given an array of integers...",
  metaKind: "function",
  metaData: {},
  exampleInputAll: "[2,7,11,15]",
  exampleInputFirst: "[2,7,11,15]",
  likes: 100,
  dislikes: 10,
  totalAccepted: 1000,
  totalSubmitted: 2000,
  statsFetchedAt: "2026-09-08T00:00:00.000Z",
  createdAt: "2026-09-08T00:00:00.000Z",
  updatedAt: "2026-09-08T00:00:00.000Z",
};

test("GET /api/problem returns problems and the next cursor", async (t) => {
  let received: unknown;
  const request = await setup(t, { getProblemPage: async (options) => {
    received = options;
    return [listItem];
  } });
  const response = await request("/api/problem?after=10");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { problems: [listItem], nextCursor: 1 });
  assert.deepEqual(received, { after: 10 });
});

for (const [query, after] of [
  ["", undefined], ["?after=0", undefined], ["?after=garbage", undefined],
  ["?after=-999999999999", undefined], ["?after=10.9", 10],
  ["?after=999999999999", 2_147_483_647], ["?after=Infinity", 2_147_483_647],
  ["?after=2147483647", 2_147_483_647], ["?after=2147483648", 2_147_483_647],
  ["?after=10&after=20", 10], ["?after=garbage&after=20", undefined],
] as const) {
  test(`GET /api/problem normalizes cursor ${query || "(absent)"}`, async (t) => {
    let received: unknown;
    const request = await setup(t, { getProblemPage: async (options) => {
      received = options;
      return [];
    } });
    const response = await request(`/api/problem${query}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { problems: [], nextCursor: null });
    assert.deepEqual(received, { after });
  });
}

test("GET /api/problem pages past a full 50-row page and ends with a null cursor", async (t) => {
  const firstPage = Array.from({ length: 50 }, (_, index) => ({
    ...listItem, problemId: `p_${index + 1}`, frontendId: index + 1,
  }));
  const lastProblem = { ...listItem, problemId: "p_51", frontendId: 51 };
  const request = await setup(t, { getProblemPage: async ({ after } = {}) => {
    if (after === undefined) return firstPage;
    if (after === 50) return [lastProblem];
    if (after === 51) return [];
    throw new Error(`Unexpected pagination cursor: ${after}`);
  } });

  const first = await request("/api/problem");
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { problems: firstPage, nextCursor: 50 });
  const last = await request("/api/problem?after=50");
  assert.equal(last.status, 200);
  assert.deepEqual(await last.json(), { problems: [lastProblem], nextCursor: 51 });
  const empty = await request("/api/problem?after=51");
  assert.equal(empty.status, 200);
  assert.deepEqual(await empty.json(), { problems: [], nextCursor: null });
});

test("GET /api/problem returns a generic 500 on database failure", async (t) => {
  const request = await setup(t, { getProblemPage: async () => { throw new Error("private database details"); } });
  const response = await request("/api/problem");
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Internal server error." });
});

test("GET /api/problem/:problemId returns a problem and decodes its id", async (t) => {
  let received: unknown;
  const request = await setup(t, { getProblemItem: async (id) => {
    received = id;
    return problemItem;
  } });
  const response = await request("/api/problem/two%20sum");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { problem: problemItem });
  assert.equal(received, "two sum");
});

test("GET /api/problem/:problemId returns 404 for a missing problem", async (t) => {
  const request = await setup(t, { getProblemItem: async () => null });
  const response = await request("/api/problem/missing");
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Problem not found." });
});

test("GET /api/problem/:problemId returns a generic 500 on database failure", async (t) => {
  const request = await setup(t, { getProblemItem: async () => { throw new Error("private database details"); } });
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
  test(`unrecognized database errors with status ${status} remain generic JSON 500`, async (t) => {
    const request = await setup(t, { getProblemPage: async () => {
      throw Object.assign(new Error("private database details"), { status, type: "database.query.failed" });
    } });
    const response = await request("/api/problem");
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Internal server error." });
  });
}
