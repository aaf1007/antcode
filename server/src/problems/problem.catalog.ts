import { db } from "../db/prisma/db.ts";
import type {
  ProblemItem,
  ProblemPage,
  WorkbenchLanguageSlug,
  WorkbenchPayload,
} from "../types/problem.types.ts";

const PAGE_SIZE = 50;
const MAX_CURSOR = 2_147_483_647;

export async function listProblems(cursor: string | null): Promise<ProblemPage> {
  const after = parseCursor(cursor);
  let query = db.orm.public.Problem
    .select(
      "problemId",
      "slug",
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

export async function findProblem(slug: string): Promise<ProblemItem | null> {
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
    .first({ slug });
}

const WORKBENCH_LANGUAGES: readonly WorkbenchLanguageSlug[] = [
  "python3",
  "javascript",
  "java",
];

export async function findWorkbench(
  problem: ProblemItem,
): Promise<WorkbenchPayload> {
  if (problem.isPremium) {
    return { availability: "unavailable", reason: "premium" };
  }
  if (problem.category !== "Algorithms") {
    return { availability: "unavailable", reason: "unsupported_category" };
  }
  if (!problem.contentText) {
    return { availability: "unavailable", reason: "missing_content" };
  }

  // The contract intentionally has no Problem -> child back-reference. Querying
  // these safe, client-facing roots also makes it impossible to accidentally
  // include HiddenTestCase rows in this response.
  const [snippetRows, testCaseRows] = await Promise.all([
    db.orm.public.CodeSnippet
      .where({ problemId: problem.problemId })
      .select("code")
      .include("language", (language) => language.select("slug", "name"))
      .all(),
    db.orm.public.TestCase
      .where({ problemId: problem.problemId })
      .select("idx", "input", "expected")
      .orderBy((testCase) => testCase.idx.asc())
      .all(),
  ]);

  const snippets = new Map(
    snippetRows.map((snippet) => [snippet.language.slug, snippet]),
  );
  const languages = WORKBENCH_LANGUAGES.flatMap((slug) => {
    const snippet = snippets.get(slug);
    return snippet
      ? [{ slug, name: displayLanguageName(slug), starterCode: snippet.code }]
      : [];
  });

  if (languages.length !== WORKBENCH_LANGUAGES.length) {
    return { availability: "unavailable", reason: "missing_content" };
  }

  return {
    availability: "ready",
    languages,
    testCases: testCaseRows.map((testCase) => ({
      index: testCase.idx,
      input: testCase.input,
      expected: testCase.expected,
    })),
  };
}

function displayLanguageName(slug: WorkbenchLanguageSlug): string {
  if (slug === "python3") return "Python 3";
  if (slug === "javascript") return "JavaScript";
  return "Java";
}

function parseCursor(cursor: string | null): number | undefined {
  const value = Math.trunc(Number(cursor));
  return value > 0 ? Math.min(value, MAX_CURSOR) : undefined;
}
