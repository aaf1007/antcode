import { getProblemItem } from "@/features/problems/problem.queries";
import type { ProblemItem } from "@/features/problems/problem.types";

type ProblemResponse =
  | { problem: ProblemItem }
  | { error: string };

function jsonResponse(body: ProblemResponse, init?: ResponseInit): Response {
  return Response.json(body, init);
}

// GET /api/problem/:problemId
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ problemId: string }> },
): Promise<Response> {
  const { problemId } = await params;

  if (!problemId) {
    return jsonResponse(
      { error: "Problem id is required." },
      { status: 400 },
    );
  }

  try {
    const problem: ProblemItem | null = await getProblemItem(problemId);

    if (!problem) {
      return jsonResponse(
        { error: "Problem not found." },
        { status: 404 },
      );
    }

    return jsonResponse({ problem }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/problem/${problemId} failed`, error);
    return jsonResponse(
      { error: "Failed to load problem." },
      { status: 500 },
    );
  }
}
