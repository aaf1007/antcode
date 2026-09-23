import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type {
  ProblemDetailResponse,
  ProblemItem,
  ProblemListItem,
  WorkbenchLanguageSlug,
} from "./problem.types";

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

  detail: (slug: string) => queryOptions({
    queryKey: ["problem", slug] as const,
    queryFn: () => fetchProblem(slug),
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

async function fetchProblem(slug: string): Promise<ProblemDetailResponse | null> {
  const response = await fetch(`/api/problem/${encodeURIComponent(slug)}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load problem.");

  return parseProblemDetailResponse(await response.json());
}

const LANGUAGE_SLUGS = new Set<WorkbenchLanguageSlug>([
  "python3",
  "javascript",
  "java",
]);

export function parseProblemDetailResponse(value: unknown): ProblemDetailResponse {
  if (!isRecord(value) || !isProblem(value.problem) || !isRecord(value.workbench)) {
    throw new Error("The problem response was invalid.");
  }

  const workbench = value.workbench;
  if (workbench.availability === "unavailable") {
    if (
      workbench.reason !== "premium" &&
      workbench.reason !== "unsupported_category" &&
      workbench.reason !== "missing_content"
    ) {
      throw new Error("The problem response was invalid.");
    }
    return {
      problem: value.problem as ProblemItem,
      workbench: { availability: "unavailable", reason: workbench.reason },
    };
  }

  if (
    workbench.availability !== "ready" ||
    !Array.isArray(workbench.languages) ||
    !Array.isArray(workbench.testCases)
  ) {
    throw new Error("The problem response was invalid.");
  }

  const languages = workbench.languages.map((language) => {
    if (
      !isRecord(language) ||
      typeof language.slug !== "string" ||
      !LANGUAGE_SLUGS.has(language.slug as WorkbenchLanguageSlug) ||
      typeof language.name !== "string" ||
      typeof language.starterCode !== "string"
    ) throw new Error("The problem response was invalid.");
    return {
      slug: language.slug as WorkbenchLanguageSlug,
      name: language.name,
      starterCode: language.starterCode,
    };
  });

  const testCases = workbench.testCases.map((testCase) => {
    if (
      !isRecord(testCase) ||
      typeof testCase.index !== "number" ||
      typeof testCase.input !== "string" ||
      typeof testCase.expected !== "string"
    ) throw new Error("The problem response was invalid.");
    return { index: testCase.index, input: testCase.input, expected: testCase.expected };
  });

  return {
    problem: value.problem as ProblemItem,
    workbench: { availability: "ready", languages, testCases },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProblem(value: unknown): value is ProblemItem {
  return isRecord(value) &&
    typeof value.problemId === "string" &&
    typeof value.slug === "string" &&
    typeof value.frontendId === "number" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.isPremium === "boolean";
}
