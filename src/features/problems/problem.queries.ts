import "server-only";

import { db } from "../../../database/prisma/db";
import type { ProblemItem, ProblemList } from "./problem.types";

export const PAGE_SIZE = 50; // Fixed rows per page

export type ProblemPageOptions = {
  limit?: number;
  after?: number;
};

export async function getProblemPage({
  limit = PAGE_SIZE,
  after,
}: ProblemPageOptions = {}): Promise<ProblemList> {
  // Query db and return a page of problems, ordered by frontendId ascending. If after is provided, return the next page after that frontendId.
  const catalog = db.orm.public.Problem.select(
    "problemId",
    "frontendId",
    "title",
    "url",
    "difficulty",
    "category",
    "isPremium",
    "acRate",
  ).orderBy((p) => p.frontendId.asc());

  if (after === undefined) {
    return catalog.limit(limit).all();
  }

  return catalog.cursor({ frontendId: after }).limit(limit).all();
}

export async function getProblemItem(
  problemId: string,
): Promise<ProblemItem | null> {
  return db.orm.public.Problem.first({ problemId });
}
