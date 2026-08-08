import { Router } from "express";
import * as problemService from "../services/problem.service.js";
import { ProblemPagination, ProblemSnippet } from "../types/problem.js";

const problemRouter = Router();

/**
 * GET /api/problem
 * Returns a paginated slice of LeetCode problems from the upstream API.
 *
 * Query params:
 *   - limit (number, default 30) — page size
 *   - jump  (number, default 0)  — start index into the full list
 */
problemRouter.get("/", async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 30;
        const jump = Number(req.query.jump) || 0;

        const allData = await problemService.getAllProblemsList();
        const currentPage: ProblemSnippet[] = allData.slice(jump, limit + jump);

        const body: ProblemPagination = {
            problems: currentPage,
            hasMore: limit + jump - allData.length > 0
        };

        res.status(200).json(body);
    } catch (err) {
        res.status(502).json({ err: "Could not fetch problems" });
    }
});

problemRouter.get("/:problemId", async (req, res) => {
    const problemId = req.params.problemId;

    try {
        // TODO: db call
        
        // TODO:
        const body = {};

        res.status(200).json(body);
    } catch (err) {
        res.status(502).json({ err: `Could not fetch problem ${problemId}` });
    }
});

export default problemRouter;
