import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Problem, ProblemSnippet } from "../types/problem.js";

/**
 * Returns every problem in the database.
 * Callers are responsible for slicing/paginating the result.
 */
export async function getAllProblemsList(): Promise<ProblemSnippet[]>  {
    const data = await getDb(); // returns Problem[]
    const snippet: ProblemSnippet[] = data.map(({ questionId, title, difficulty, topicTags, acRate }) => ({
        questionId,
        title,
        difficulty,
        topicTags,
        acRate
    }));

    return snippet as ProblemSnippet[];
}

/**
 * Looks up a single problem by its LeetCode `questionId`.
 *
 * @param problemid — the `questionId` to match (string, not the frontend id)
 * @returns the matching problem, or `undefined` if there is no match
 *          (the `as Problem` cast hides this — see TODO below)
 */
export async function getProblem(problemid: string) : Promise<Problem | undefined> {
    const data = await getDb();
    const found = data.find((problem: any) => problem.questionId === problemid);

    return found;
}

/**
 * Loads the problem set from the local JSON file that stands in for a real db.
 *
 * Reads and parses on every call — fine for the mock, but replace this with the
 * actual db query (and drop the file read) once the schema is finalized.
 * TODO: Change this to real db call using Sequelize
 */
async function getDb() : Promise<Problem[]> {
    // ESM has no __dirname, so rebuild it from import.meta.url to keep the
    // path relative to this file rather than the process cwd.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const mockProblemsPath = path.resolve(__dirname, "../../db/problems.json");

    const raw = await readFile(mockProblemsPath, "utf-8");
    const data = JSON.parse(raw);

    return data;
}
