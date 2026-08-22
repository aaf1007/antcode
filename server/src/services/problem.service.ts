import * as db from "../db/problem.repo.js";
import { Problem, ProblemSnippet } from "../types/problem.js";
/**
 * Returns every problem in the database.
 * Callers are responsible for slicing/paginating the result.
 */
export async function getAllProblemsList(): Promise<ProblemSnippet[]>  {
    const snippet = await db.findAllSnippets();
    return snippet;
}

/**
 * Looks up a single problem by its LeetCode `questionId`.
 *
 * @param problemId — the `questionId` to match (string, not the frontend id)
 * @returns the matching problem, or `null` if there is no match
 *          (the `as Problem` cast hides this — see TODO below)
 */
export async function getProblemById(problemId: string) : Promise<Problem | null> {
    const data = await db.findProblemById(problemId);
    return data;
}
