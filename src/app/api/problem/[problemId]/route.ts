import { getProblemById } from "@/features/problems/problem.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ problemId: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { problemId } = await context.params;

  try {
    const problem = await getProblemById(problemId);

    if (!problem) {
      return Response.json(
        { err: `Problem ${problemId} not be found` },
        { status: 404 },
      );
    }

    return Response.json(problem, { status: 200 });
  } catch (error) {
    console.error(`Could not fetch problem ${problemId}`, error);
    return Response.json(
      { err: `Could not fetch problem ${problemId}` },
      { status: 502 },
    );
  }
}
