// Seeds the problem catalog from database/raw/leetcode_problems.json.
//
// Run with: npm run seed
//
// This is a wipe-and-reload: every table it owns is emptied first, so the
// script is safe to re-run and always produces the same result.
//
// Surrogate ids are derived from stable upstream keys rather than left to the
// contract's cuid(2) default, so re-seeding produces identical ids on every
// machine. That keeps fixtures, screenshots and bug reports comparable across
// the team. Nothing outside this file should depend on their shape.

import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { db } from "../prisma/db";

const RAW = fileURLToPath(new URL("../raw/leetcode_problems.json", import.meta.url));

type Topic = { name: string; slug: string };
type Snippet = { lang: string; lang_slug: string; code: string };
type Case = { idx: number; kind: string; input: string; expected: string; source: string };
type Similar = { title: string; titleSlug: string; difficulty: string };

type RawProblem = {
  question_id: number;
  frontend_id: number;
  title: string;
  slug: string;
  url: string;
  difficulty: string;
  is_premium: boolean;
  category: string;
  topics: Topic[];
  likes: number;
  dislikes: number;
  ac_rate: number;
  total_accepted: number;
  total_submitted: number;
  content_html: string | null;
  content_text: string | null;
  hints: string[];
  similar_questions: Similar[];
  example_testcases: string;
  sample_testcase: string;
  meta_data: Record<string, unknown>;
  code_snippets: Snippet[];
  test_cases: Case[];
  hidden_test_cases: Case[];
};

const sql = (db as any).sql.public;

// Postgres caps a statement at 65535 bind parameters. Size each batch from the
// row's column count so wide tables (problem: 23 columns) stay well under it.
async function insertAll(table: string, rows: Record<string, unknown>[]): Promise<number> {
  if (rows.length === 0) return 0;
  const columns = Object.keys(rows[0]).length;
  const chunkSize = Math.max(1, Math.min(2000, Math.floor(50_000 / columns)));
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await db.runtime().execute(sql[table].insert(chunk).build());
  }
  return rows.length;
}

// meta_data comes in four incompatible shapes; metaKind records which, so the
// shape can be filtered on without reaching into the Jsonb column.
function metaKindOf(meta: Record<string, unknown> | null): string {
  if (!meta || typeof meta !== "object") return "function";
  if (meta.classname) return "design";
  if (meta.database || meta.database_schema || meta.mysql) return "database";
  if (Array.isArray(meta.params)) return "function";
  if (meta.shell) return "shell";
  return "function";
}

async function main() {
  const startedAt = Date.now();

  const problems: RawProblem[] = JSON.parse(readFileSync(RAW, "utf8"));
  // The upstream stats are a snapshot; date them by the file, not by "now".
  // Timestamp columns use Postgres's own text form (see contract.prisma), so
  // these are ISO strings rather than Date objects.
  const statsFetchedAt = statSync(RAW).mtime.toISOString();
  const now = new Date().toISOString();
  console.log(`Read ${problems.length} problems from leetcode_problems.json`);

  // Children first — every FK cascades, but explicit order keeps this readable
  // and independent of cascade behaviour.
  for (const table of [
    "similarProblem", "testCase", "hiddenTestCase", "problemHint",
    "codeSnippet", "problemTopic", "problem", "topic", "language",
  ]) {
    await db.runtime().execute(sql[table].delete().build());
  }
  console.log("Cleared existing rows");

  const problemId = (p: RawProblem) => `p_${p.question_id}`;
  const topicId = (slug: string) => `t_${slug}`;
  const languageId = (slug: string) => `l_${slug}`;

  // --- Reference tables, deduplicated across every problem -----------------
  const topics = new Map<string, Record<string, unknown>>();
  const languages = new Map<string, Record<string, unknown>>();
  for (const p of problems) {
    for (const t of p.topics) {
      if (!topics.has(t.slug)) topics.set(t.slug, { topicId: topicId(t.slug), slug: t.slug, name: t.name });
    }
    for (const c of p.code_snippets) {
      if (!languages.has(c.lang_slug)) {
        languages.set(c.lang_slug, { languageId: languageId(c.lang_slug), slug: c.lang_slug, name: c.lang });
      }
    }
  }

  // --- Rows ----------------------------------------------------------------
  const problemRows: Record<string, unknown>[] = [];
  const problemTopicRows: Record<string, unknown>[] = [];
  const codeSnippetRows: Record<string, unknown>[] = [];
  const hintRows: Record<string, unknown>[] = [];
  const testCaseRows: Record<string, unknown>[] = [];
  const hiddenTestCaseRows: Record<string, unknown>[] = [];
  const similarRows: Record<string, unknown>[] = [];

  const knownSlugs = new Set(problems.map((p) => p.slug));
  const bySlug = new Map(problems.map((p) => [p.slug, p]));

  for (const p of problems) {
    const id = problemId(p);

    problemRows.push({
      problemId: id,
      questionId: p.question_id,
      frontendId: p.frontend_id,
      slug: p.slug,
      title: p.title,
      url: p.url,
      difficulty: p.difficulty,
      category: p.category,
      isPremium: p.is_premium,
      // Premium problems ship as metadata-only stubs — no body, no snippets,
      // no test cases. Kept in the catalog so the numbering stays gap-free.
      contentHtml: p.content_html,
      contentText: p.content_text,
      metaKind: metaKindOf(p.meta_data),
      metaData: p.meta_data,
      exampleInputAll: p.example_testcases,
      exampleInputFirst: p.sample_testcase,
      likes: p.likes,
      dislikes: p.dislikes,
      acRate: p.ac_rate,
      totalAccepted: p.total_accepted,
      totalSubmitted: p.total_submitted,
      statsFetchedAt,
      createdAt: now,
      updatedAt: now,
    });

    const seenTopics = new Set<string>();
    for (const t of p.topics) {
      if (seenTopics.has(t.slug)) continue;
      seenTopics.add(t.slug);
      problemTopicRows.push({ problemId: id, topicId: topicId(t.slug) });
    }

    const seenLangs = new Set<string>();
    for (const c of p.code_snippets) {
      if (seenLangs.has(c.lang_slug)) continue;
      seenLangs.add(c.lang_slug);
      codeSnippetRows.push({ problemId: id, languageId: languageId(c.lang_slug), code: c.code });
    }

    p.hints.forEach((text, idx) => hintRows.push({ problemId: id, idx, text }));

    for (const c of p.test_cases) {
      testCaseRows.push({ problemId: id, idx: c.idx, input: c.input, expected: c.expected });
    }
    // Empty for every problem in the current dataset; handled so a future
    // dataset that populates it seeds without a code change.
    for (const c of p.hidden_test_cases) {
      hiddenTestCaseRows.push({ problemId: id, idx: c.idx, input: c.input, expected: c.expected });
    }

    // Every edge in the source is symmetric, so iterating each problem's list
    // naturally produces both directions.
    const seenSimilar = new Set<string>();
    for (const s of p.similar_questions) {
      if (!knownSlugs.has(s.titleSlug) || seenSimilar.has(s.titleSlug)) continue;
      seenSimilar.add(s.titleSlug);
      similarRows.push({ problemId: id, similarProblemId: problemId(bySlug.get(s.titleSlug)!) });
    }
  }

  // --- Insert, parents before children -------------------------------------
  const counts: Record<string, number> = {};
  counts.topic = await insertAll("topic", [...topics.values()]);
  counts.language = await insertAll("language", [...languages.values()]);
  counts.problem = await insertAll("problem", problemRows);
  counts.problemTopic = await insertAll("problemTopic", problemTopicRows);
  counts.codeSnippet = await insertAll("codeSnippet", codeSnippetRows);
  counts.problemHint = await insertAll("problemHint", hintRows);
  counts.testCase = await insertAll("testCase", testCaseRows);
  counts.hiddenTestCase = await insertAll("hiddenTestCase", hiddenTestCaseRows);
  counts.similarProblem = await insertAll("similarProblem", similarRows);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log("\nSeeded:");
  for (const [table, n] of Object.entries(counts)) {
    console.log(`  ${table.padEnd(16)} ${n.toLocaleString().padStart(7)}`);
  }
  console.log(`  ${"TOTAL".padEnd(16)} ${total.toLocaleString().padStart(7)} rows in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
}

try {
  await main();
} finally {
  await db.close();
}
