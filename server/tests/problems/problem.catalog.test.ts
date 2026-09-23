import assert from "node:assert/strict";
import { mock, test, type TestContext } from "node:test";

const rows = Array.from({ length: 51 }, (_, index) => ({
  problemId: `p_${index + 1}`,
  frontendId: index + 1,
  title: `Problem ${index + 1}`,
  url: `https://example.test/problems/${index + 1}`,
  difficulty: "Easy" as const,
  category: "Algorithms" as const,
  isPremium: false,
  acRate: 50,
  slug: `problem-${index + 1}`,
  contentText: `Description ${index + 1}`,
  exampleInputFirst: String(index + 1),
  likes: index + 1,
  dislikes: 0,
  totalAccepted: 100,
  totalSubmitted: 200,
}));

let availableRows = rows;
let detailRow: (typeof rows)[number] | null = rows[0]!;
let snippetRows = [
  { code: "py", language: { slug: "python3", name: "Python3" } },
  { code: "js", language: { slug: "javascript", name: "JavaScript" } },
  { code: "java", language: { slug: "java", name: "Java" } },
];
let testCaseRows = [{ idx: 0, input: "1", expected: "2" }];

function selectFields(row: Record<string, unknown>, fields: string[]) {
  return Object.fromEntries(fields.map((field) => [field, row[field]]));
}

function collection(fields: string[], after?: number) {
  let limit = Number.POSITIVE_INFINITY;

  return {
    orderBy: () => collection(fields, after),
    cursor: ({ frontendId }: { frontendId: number }) => collection(fields, frontendId),
    limit(value: number) {
      limit = value;
      return this;
    },
    async all() {
      return availableRows
        .filter((problem) => after === undefined || problem.frontendId > after)
        .slice(0, limit)
        .map((problem) => selectFields(problem, fields));
    },
    async first(where: { slug: string }) {
      if (detailRow !== null) assert.deepEqual(where, { slug: detailRow.slug });
      return detailRow === null ? null : selectFields(detailRow, fields);
    },
  };
}

const Problem = {
  select: (...fields: string[]) => collection(fields),
};

const CodeSnippet = {
  where: () => ({
    select: () => ({
      include: () => ({ all: async () => snippetRows }),
    }),
  }),
};

const TestCase = {
  where: () => ({
    select: () => ({
      orderBy: () => ({ all: async () => testCaseRows }),
    }),
  }),
};

mock.module(new URL("../../src/db/prisma/db.ts", import.meta.url), {
  namedExports: { db: { orm: { public: { Problem, CodeSnippet, TestCase } } } },
});

const { findProblem, findWorkbench, listProblems } = await import(
  "../../src/problems/problem.catalog.ts"
);

function resetRows(t: TestContext) {
  availableRows = rows;
  detailRow = rows[0]!;
  snippetRows = [
    { code: "py", language: { slug: "python3", name: "Python3" } },
    { code: "js", language: { slug: "javascript", name: "JavaScript" } },
    { code: "java", language: { slug: "java", name: "Java" } },
  ];
  testCaseRows = [{ idx: 0, input: "1", expected: "2" }];
  t.after(() => {
    availableRows = rows;
    detailRow = rows[0]!;
    snippetRows = [
      { code: "py", language: { slug: "python3", name: "Python3" } },
      { code: "js", language: { slug: "javascript", name: "JavaScript" } },
      { code: "java", language: { slug: "java", name: "Java" } },
    ];
    testCaseRows = [{ idx: 0, input: "1", expected: "2" }];
  });
}

test("catalog returns pages of 50 and a cursor when more rows exist", async (t) => {
  resetRows(t);

  const firstPage = await listProblems(null);
  const lastPage = await listProblems("50.9");

  assert.equal(firstPage.problems.length, 50);
  assert.equal(firstPage.nextCursor, 50);
  assert.equal(lastPage.problems[0]?.frontendId, 51);
  assert.equal(lastPage.nextCursor, null);
});

test("workbench returns required languages in order and visible cases", async (t) => {
  resetRows(t);
  const result = await findWorkbench(rows[0]!);
  assert.deepEqual(result, {
    availability: "ready",
    languages: [
      { slug: "python3", name: "Python 3", starterCode: "py" },
      { slug: "javascript", name: "JavaScript", starterCode: "js" },
      { slug: "java", name: "Java", starterCode: "java" },
    ],
    testCases: [{ index: 0, input: "1", expected: "2" }],
  });
  assert.equal(JSON.stringify(result).includes("hidden"), false);
});

test("workbench returns tagged reasons for ineligible and incomplete problems", async (t) => {
  resetRows(t);
  assert.deepEqual(await findWorkbench({ ...rows[0]!, isPremium: true }), { availability: "unavailable", reason: "premium" });
  assert.deepEqual(await findWorkbench({ ...rows[0]!, category: "Database" }), { availability: "unavailable", reason: "unsupported_category" });
  snippetRows = snippetRows.slice(0, 2);
  assert.deepEqual(await findWorkbench(rows[0]!), { availability: "unavailable", reason: "missing_content" });
});

test("workbench stays ready without visible cases", async (t) => {
  resetRows(t);
  testCaseRows = [];
  const result = await findWorkbench(rows[0]!);
  assert.equal(result.availability, "ready");
  if (result.availability === "ready") assert.deepEqual(result.testCases, []);
});

test("catalog omits the cursor on an exact final page", async (t) => {
  resetRows(t);
  availableRows = rows.slice(0, 50);

  const page = await listProblems(null);

  assert.equal(page.problems.length, 50);
  assert.equal(page.nextCursor, null);
});

test("catalog handles invalid and oversized cursors", async (t) => {
  resetRows(t);

  assert.equal((await listProblems("garbage")).problems[0]?.frontendId, 1);
  assert.deepEqual(await listProblems("Infinity"), { problems: [], nextCursor: null });
});

test("catalog returns problem details or null", async (t) => {
  resetRows(t);

  const problem = await findProblem("problem-1");
  assert.equal(problem?.problemId, "p_1");
  assert.equal(problem?.contentText, "Description 1");
  assert.equal(problem?.slug, "problem-1");

  detailRow = null;
  assert.equal(await findProblem("missing"), null);
});
