import { getProblemItem } from "@/features/problems/problem.queries";

// GET /api/problem/:problemId
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ problemId: string }> },
): Promise<Response> {
  const { problemId } = await params;

  if (!problemId) {
    return Response.json({ error: "Problem id is required." }, { status: 400 });
  }

  try {
    const problem = await getProblemItem(problemId);

    if (!problem) {
      return Response.json({ error: "Problem not found." }, { status: 404 });
    }

    return Response.json({ problem }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/problem/${problemId} failed`, error);
    return Response.json({ error: "Failed to load problem." }, { status: 500 });
  }
}
