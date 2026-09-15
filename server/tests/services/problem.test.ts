import assert from "node:assert/strict";
import { test } from "node:test";
import { stubRepository } from "../helpers/repository.ts";
import type { ProblemListItem } from "../../src/types/problem.types.ts";

const { listProblems, getProblemItem } = await import("../../src/services/problem.service.ts");

test("problem service normalizes pagination and derives the next cursor", async (t) => {
  const problem: ProblemListItem = {
    problemId: "p_51", frontendId: 51, title: "N-Queens", url: "https://leetcode.com/problems/n-queens/",
    difficulty: "Hard", category: "Algorithms", isPremium: false, acRate: 70,
  };
  let received: unknown;
  stubRepository(t, {
    getProblemPage: async (options) => { received = options; return [problem]; },
    getProblemItem: async () => null,
  });
  assert.deepEqual(await listProblems("50.9"), { problems: [problem], nextCursor: 51 });
  assert.deepEqual(received, { after: 50 });
});

test("problem service preserves repository errors for the HTTP layer", async (t) => {
  const failure = new Error("database unavailable");
  stubRepository(t, {
    getProblemPage: async () => { throw failure; },
    getProblemItem: async () => null,
  });
  await assert.rejects(listProblems(null), (error) => error === failure);
  assert.equal(await getProblemItem("missing"), null);
});

test("problem detail service preserves repository errors for the HTTP layer", async (t) => {
  const failure = new Error("database unavailable");
  stubRepository(t, { getProblemItem: async () => { throw failure; } });
  await assert.rejects(getProblemItem("two-sum"), (error) => error === failure);
});
