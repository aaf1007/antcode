import type { ProblemItem, ProblemListItem } from "@/features/problems/problem.types";
import assert from "node:assert/strict";
import { mock, test } from "node:test";

const queryState: {
  page: ProblemListItem[];
  item: ProblemItem | null;
  pageError: Error | null;
  itemError: Error | null;
  pageOptions: unknown;
} = {
  page: [],
  item: null,
  pageError: null,
  itemError: null,
  pageOptions: undefined,
};

mock.module("@/features/problems/problem.queries", {
  namedExports: {
    getProblemPage: async (options: unknown) => {
      queryState.pageOptions = options;
      if (queryState.pageError) throw queryState.pageError;
      return queryState.page;
    },
    getProblemItem: async () => {
      if (queryState.itemError) throw queryState.itemError;
      return queryState.item;
    },
  },
});

const [{ GET: getProblemPage }, { GET: getProblemItem }] = await Promise.all([
  import("@/app/api/problem/route"),
  import("@/app/api/problem/[problemId]/route"),
]);

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

test("GET /api/problem returns problems and the next cursor", async () => {
  queryState.page = [listItem];
  queryState.pageError = null;

  const response = await getProblemPage(
    new Request("http://localhost/api/problem?after=10"),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    problems: [listItem],
    nextCursor: 1,
  });
  assert.deepEqual(queryState.pageOptions, { after: 10 });
});

test("GET /api/problem clamps an oversized cursor", async () => {
  queryState.page = [];
  queryState.pageError = null;

  await getProblemPage(
    new Request("http://localhost/api/problem?after=999999999999"),
  );

  assert.deepEqual(queryState.pageOptions, { after: 2_147_483_647 });
});

test("GET /api/problem returns 500 when loading the page fails", async () => {
  queryState.pageError = new Error("database unavailable");

  const response = await getProblemPage(
    new Request("http://localhost/api/problem"),
  );

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    error: "Failed to load problems.",
  });
  queryState.pageError = null;
});

test("GET /api/problem/:problemId returns a problem", async () => {
  queryState.item = problemItem;
  queryState.itemError = null;

  const response = await getProblemItem(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "two-sum" }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { problem: problemItem });
});

test("GET /api/problem/:problemId returns 400 without an id", async () => {
  const response = await getProblemItem(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "" }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Problem id is required.",
  });
});

test("GET /api/problem/:problemId returns 404 when the problem is missing", async () => {
  queryState.item = null;
  queryState.itemError = null;

  const response = await getProblemItem(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "missing" }),
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: "Problem not found.",
  });
});

test("GET /api/problem/:problemId returns 500 when loading the problem fails", async () => {
  queryState.itemError = new Error("database unavailable");

  const response = await getProblemItem(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "two-sum" }),
  });

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    error: "Failed to load problem.",
  });
  queryState.itemError = null;
});