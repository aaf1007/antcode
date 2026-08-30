import { getAllProblemsList } from "@/features/problems/problem.service";
import type { ProblemPagination, ProblemSnippet } from "@/features/problems/problem.types";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const limit = Number(searchParams.get("limit")) || 30;
    const jump = Number(searchParams.get("jump")) || 0;

    const allData = await getAllProblemsList();
    const problems: ProblemSnippet[] = allData.slice(jump, limit + jump);
    const body: ProblemPagination = {
      problems,
      hasMore: limit + jump < allData.length,
    };

    return Response.json(body, { status: 200 });
  } catch (error) {
    console.error("Could not fetch problems", error);
    return Response.json({ err: "Could not fetch problems" }, { status: 502 });
  }
}
