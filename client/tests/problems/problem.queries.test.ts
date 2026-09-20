import assert from "node:assert/strict";
import { mock, test, type TestContext } from "node:test";
import { QueryClient } from "@tanstack/react-query";
import { problemQueries } from "../../src/features/problems/problem.queries.ts";

const problem = {
  problemId: "two-sum",
  frontendId: 1,
  title: "Two Sum",
  url: "https://leetcode.com/problems/two-sum/",
  difficulty: "Easy" as const,
  category: "Algorithms" as const,
  isPremium: false,
  acRate: 56.4,
};

function setup(t: TestContext, fetchImplementation: (input: string) => Promise<Response>) {
  const originalFetch = globalThis.fetch;
  const fetchMock = mock.fn(fetchImplementation);
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  t.after(() => {
    globalThis.fetch = originalFetch;
    queryClient.clear();
  });

  return { fetchMock, queryClient };
}

test("problem catalog loads each page", async (t) => {
  const { fetchMock, queryClient } = setup(t, async (url) => {
    if (url === "/api/problem") {
      return Response.json({ problems: [problem], nextCursor: 1 });
    }

    return Response.json({
      problems: [{ ...problem, problemId: "add-two", frontendId: 2 }],
      nextCursor: null,
    });
  });

  const data = await queryClient.fetchInfiniteQuery({
    ...problemQueries.catalog(),
    pages: 2,
  });

  assert.deepEqual(
    data.pages.map((page) => page.problems.map((item) => item.frontendId)),
    [[1], [2]],
  );
  assert.deepEqual(
    fetchMock.mock.calls.map((call) => call.arguments[0]),
    ["/api/problem", "/api/problem?after=1"],
  );
});

test("failed problem requests show a useful error", async (t) => {
  const { queryClient } = setup(
    t,
    async () => Response.json({ error: "Unavailable" }, { status: 503 }),
  );

  await assert.rejects(
    queryClient.fetchInfiniteQuery(problemQueries.catalog()),
    /Failed to load problems/,
  );
});

test("problem details are cached while fresh", async (t) => {
  const detail = {
    ...problem,
    slug: "two-sum",
    contentText: "Given an array of integers...",
    exampleInputFirst: "[2,7,11,15]",
    likes: 100,
    dislikes: 10,
    totalAccepted: 1_000,
    totalSubmitted: 2_000,
  };
  const { fetchMock, queryClient } = setup(
    t,
    async () => Response.json({ problem: detail }),
  );

  assert.deepEqual(await queryClient.fetchQuery(problemQueries.detail("two-sum")), detail);
  assert.deepEqual(await queryClient.fetchQuery(problemQueries.detail("two-sum")), detail);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("missing problem details return null", async (t) => {
  const { fetchMock, queryClient } = setup(
    t,
    async () => Response.json({ error: "Problem not found." }, { status: 404 }),
  );

  const result = await queryClient.fetchQuery(problemQueries.detail("missing/problem"));

  assert.equal(result, null);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(fetchMock.mock.calls[0]?.arguments[0], "/api/problem/missing%2Fproblem");
});
