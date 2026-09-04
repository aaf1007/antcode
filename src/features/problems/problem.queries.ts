import "server-only";

import { db } from "../../../database/prisma/db";
import type { ProblemList } from "./problem.types";

export const PAGE_SIZE = 50; // Fixed rows per page

export type ProblemPageOptions = {
  limit?: number;
  after?: number;
};

export async function getProblemPage({
  limit = PAGE_SIZE,
  after,
}: ProblemPageOptions = {}): Promise<ProblemList> {
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
