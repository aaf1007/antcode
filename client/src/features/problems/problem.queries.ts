import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { ProblemItem, ProblemListItem } from "./problem.types";

export type ProblemPage = {
  problems: ProblemListItem[];
  nextCursor: number | null;
};

export const problemQueries = {
  catalog: () => infiniteQueryOptions({
    queryKey: ["problems"] as const,
    queryFn: ({ pageParam }) => fetchProblemPage(pageParam),
    initialPageParam: null as number | null,
    getNextPageParam: (page) => page.nextCursor,
    staleTime: 5 * 60 * 1_000,
  }),

  detail: (problemId: string) => queryOptions({
    queryKey: ["problem", problemId] as const,
    queryFn: () => fetchProblem(problemId),
    staleTime: 5 * 60 * 1_000,
  }),
};

async function fetchProblemPage(after: number | null): Promise<ProblemPage> {
  const search = after === null ? "" : `?after=${after}`;
  const response = await fetch(`/api/problem${search}`);

  if (!response.ok) {
    throw new Error("Failed to load problems.");
  }

  return response.json() as Promise<ProblemPage>;
}

async function fetchProblem(problemId: string): Promise<ProblemItem | null> {
  const response = await fetch(`/api/problem/${encodeURIComponent(problemId)}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load problem.");

  const data = await response.json() as { problem: ProblemItem };
  return data.problem;
}
