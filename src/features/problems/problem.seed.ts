/**
 * Seeds the `problems` table from data/problems.json.
 *
 *   npm run seed            — create the table if needed, then upsert every row
 *   npm run seed -- --force — DROP the table and recreate it before seeding
 *
 * Safe to re-run: rows are upserted on `questionId`, so re-seeding refreshes
 * existing problems rather than erroring on the primary key.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { sequelize } from "@/lib/db/sequelize";
import { Problem as ProblemModel } from "./problem.model";
import type { Problem } from "./problem.types";

const SOURCE = fileURLToPath(new URL("./data/problems.json", import.meta.url));

/** Rows per INSERT. The JSON blobs are large, so keep batches modest. */
const BATCH_SIZE = 50;

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

/**
 * Every column except the primary key. `bulkCreate` needs this explicitly to
 * know what to overwrite when it hits an existing `questionId`.
 */
const UPDATABLE_COLUMNS = [
  "questionFrontendId",
  "title",
  "titleSlug",
  "difficulty",
  "isPaidOnly",
  "content",
  "topicTags",
  "codeSnippets",
  "hints",
  "exampleTestcases",
  "likes",
  "dislikes",
  "acRate",
  "totalAccepted",
  "neetcode",
] as const;

/**
 * Fails loudly on malformed input rather than letting Postgres reject the row
 * halfway through the batch, where the error message is far less useful.
 */
function validate(problems: unknown): Problem[] {
  if (!Array.isArray(problems)) {
    throw new Error(`${SOURCE} must contain a JSON array, got ${typeof problems}`);
  }

  const seen = new Set<string>();

  problems.forEach((problem, i) => {
    const at = `problems[${i}]`;

    if (typeof problem?.questionId !== "string" || problem.questionId === "") {
      throw new Error(`${at}: missing questionId`);
    }
    if (seen.has(problem.questionId)) {
      throw new Error(`${at}: duplicate questionId ${problem.questionId}`);
    }
    seen.add(problem.questionId);

    if (!DIFFICULTIES.includes(problem.difficulty)) {
      throw new Error(
        `${at} (${problem.questionId}): difficulty ${JSON.stringify(problem.difficulty)} ` +
          `is not one of ${DIFFICULTIES.join(", ")}`,
      );
    }
    // The column is NOT NULL with no default, so an insert without it fails.
    if (problem.neetcode == null) {
      throw new Error(`${at} (${problem.questionId}): missing neetcode metadata`);
    }
  });

  return problems as Problem[];
}

async function seed({ force }: { force: boolean }): Promise<void> {
  const problems = validate(JSON.parse(await readFile(SOURCE, "utf-8")));
  console.log(`Read ${problems.length} problems from ${SOURCE}`);

  await sequelize.authenticate();
  console.log(`Connected to ${sequelize.getDatabaseName()}`);

  // force:true drops the table first — the only way sync() picks up column
  // changes to an existing table.
  await sequelize.sync({ force });
  console.log(force ? "Recreated table `problems`" : "Table `problems` is ready");

  // One transaction for the whole seed: a failure partway through leaves the
  // table exactly as it was rather than half-populated.
  await sequelize.transaction(async (transaction) => {
    for (let i = 0; i < problems.length; i += BATCH_SIZE) {
      const batch = problems.slice(i, i + BATCH_SIZE);

      await ProblemModel.bulkCreate(batch, {
        transaction,
        updateOnDuplicate: [...UPDATABLE_COLUMNS],
      });

      console.log(`  seeded ${Math.min(i + BATCH_SIZE, problems.length)}/${problems.length}`);
    }
  });

  const total = await ProblemModel.count();
  console.log(`Done. Table now holds ${total} problems.`);
}

const force = process.argv.includes("--force");

try {
  await seed({ force });
} catch (error) {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
