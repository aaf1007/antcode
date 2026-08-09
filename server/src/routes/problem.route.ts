import { Router } from "express";
import * as problemService from "../services/problem.service.js";
import { ProblemPagination, ProblemSnippet } from "../types/problem.js";

const problemRouter = Router();

/**
 * GET /api/problem
 * Returns a paginated slice of LeetCode problems.
 *
 * Query params:
 *   - limit (number, default 30) — page size
 *   - jump  (number, default 0)  — start index into the full list
 *
 * Sample request:
 *   curl "http://localhost:5000/api/problem?limit=2&jump=0"
 *
 * On failure: 502 { "err": "Could not fetch problems" }
 *
 * TODO: `hasMore` is inverted — the request above sits at the start of a
 * 150-problem list yet reports false. Should be `jump + limit < allData.length`.
 */
problemRouter.get("/", async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 30;
        const jump = Number(req.query.jump) || 0;

        const allData = await problemService.getAllProblemsList();
        const currentPage: ProblemSnippet[] = allData.slice(jump, limit + jump);

        const body: ProblemPagination = {
            problems: currentPage,
            hasMore: limit + jump < allData.length
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
