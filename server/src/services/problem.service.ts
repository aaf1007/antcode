import { getProblemPage } from "../db/problem.repository.ts";
import type { ProblemPage } from "../types/problem.types.ts";

export { getProblemItem } from "../db/problem.repository.ts";

const INT4_MAX = 2_147_483_647;

export async function listProblems(cursor: string | null): Promise<ProblemPage> {
  const requested = Math.trunc(Number(cursor));
  const after = requested > 0 ? Math.min(requested, INT4_MAX) : undefined;
  const problems = await getProblemPage({ after });
  return { problems, nextCursor: problems.at(-1)?.frontendId ?? null };
}
