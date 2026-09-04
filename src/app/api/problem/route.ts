import { getProblemPage } from "@/features/problems/problem.queries";

// frontendId is an int4. A value past that range reaches Postgres as an
// out-of-range comparison and surfaces as an unhandled 500, so it gets clamped
const INT4_MAX = 2_147_483_647;

// GET /api/problem?after=<frontendId>
export async function GET(request: Request) {
  const requested = Math.trunc(Number(new URL(request.url).searchParams.get("after")));
  const after = requested ? Math.min(requested, INT4_MAX) : undefined;

  try {
    const problems = await getProblemPage({ after });

    return Response.json({
      problems,
      nextCursor: problems.at(-1)?.frontendId ?? null,
    });
    
  } catch (error) {
    console.error(`GET /api/problem failed (after=${after})`, error);
    return Response.json({ error: "Failed to load problems." }, { status: 500 });
  }
}
