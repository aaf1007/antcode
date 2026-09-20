import { db } from "../db/prisma/db.ts";
import type { ProblemItem, ProblemPage } from "../types/problem.types.ts";

const PAGE_SIZE = 50;
const MAX_CURSOR = 2_147_483_647;

export async function listProblems(cursor: string | null): Promise<ProblemPage> {
  const after = parseCursor(cursor);
  let query = db.orm.public.Problem
    .select(
      "problemId",
      "frontendId",
      "title",
      "url",
      "difficulty",
      "category",
      "isPremium",
      "acRate",
    )
    .orderBy((problem) => problem.frontendId.asc());

  if (after !== undefined) {
    query = query.cursor({ frontendId: after });
  }

  // Fetch one extra row so we know whether another page exists.
  const rows = await query.limit(PAGE_SIZE + 1).all();
  const problems = rows.slice(0, PAGE_SIZE);

  return {
    problems,
    nextCursor: rows.length > PAGE_SIZE
      ? problems.at(-1)?.frontendId ?? null
      : null,
  };
}

export async function findProblem(problemId: string): Promise<ProblemItem | null> {
  return db.orm.public.Problem
    .select(
      "problemId",
      "frontendId",
      "title",
      "url",
      "difficulty",
      "category",
      "isPremium",
      "acRate",
      "slug",
      "contentText",
      "exampleInputFirst",
      "likes",
      "dislikes",
      "totalAccepted",
      "totalSubmitted",
    )
    .first({ problemId });
}

function parseCursor(cursor: string | null): number | undefined {
  const value = Math.trunc(Number(cursor));
  return value > 0 ? Math.min(value, MAX_CURSOR) : undefined;
}
