import type { ProblemSnippet } from "../types/problem.js";

const BASE_URL = "https://leetcode-api-pied.vercel.app/problems"; // API URL

/** Fetches the full list of LeetCode problems from the upstream API. */
export async function getAllProblemsList(): Promise<ProblemSnippet[]> {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
        throw new Error(`Could not fetch problems ${res.status}`);
    }

    return res.json() as Promise<ProblemSnippet[]>;
}
