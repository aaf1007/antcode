import { Router } from "express";
import { findProblem, findWorkbench, listProblems } from "../problems/problem.catalog.ts";

const router = Router();

/**
 * GET /api/problem
 * Query `after` (optional): a frontendId cursor, usually the previous page's
 * nextCursor. Missing, nonnumeric, or nonpositive values start at the first page.
 * Decimal values are truncated; positive cursors beyond int4 are clamped.
 * Response 200: `{ problems, nextCursor }` with up to 50 problems. nextCursor
 * is the final returned frontendId when another page exists, otherwise null.
 */
router.get("/", async (req, res) => {
  const queryAfter = req.query.after;
  // Preserve the first cursor when a client sends ?after=1&after=2.
  const after = Array.isArray(queryAfter) ? queryAfter[0] : queryAfter;
  const page = await listProblems(typeof after === "string" ? after : null);
  res.json(page);
});

/**
 * GET /api/problem/:slug
 * Path `slug`: the unique URL slug of a problem, such as `two-sum`.
 * Response 200: `{ problem, workbench }`; response 404: `{ error: "Problem not found." }`.
 */
router.get("/:slug", async (req, res) => {
  const problem = await findProblem(req.params.slug);

  if (!problem) {
    res.status(404).json({ error: "Problem not found." });
    return;
  }

  const workbench = await findWorkbench(problem);
  res.json({ problem, workbench });
});

/**
 * OPTIONS on the list and detail paths returns 204. Other unsupported methods
 * return 405 with `Allow: GET, HEAD, OPTIONS`; unknown API paths return 404.
 */
router.all(["/", "/:slug"], (req, res) => {
  res.set("Allow", "GET, HEAD, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  res.status(405).json({ error: "Method not allowed." });
});

export default router;
