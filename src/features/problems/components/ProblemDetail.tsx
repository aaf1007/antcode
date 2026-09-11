"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ProblemItem } from "../problem.types";

async function fetchProblem(problemId: string): Promise<ProblemItem | null> {
  const response = await fetch(`/api/problem/${encodeURIComponent(problemId)}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load problem.");

  const data: { problem: ProblemItem } = await response.json();
  return data.problem;
}

export default function ProblemDetail({ problemId }: { problemId: string }) {
  const { data: problem, isPending, isError, error, refetch } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => fetchProblem(problemId),
  });

  return (
    <>
      <Link href="/problem" className="text-accent-text hover:underline">
        Back to problems
      </Link>

      {isPending ? (
        <p role="status" className="mt-4">Loading problem…</p>
      ) : isError ? (
        <div role="alert" className="mt-4">
          <p className="text-danger">{error.message}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-accent-text hover:underline"
          >
            Retry
          </button>
        </div>
      ) : problem === null ? (
        <p className="mt-4">Problem not found.</p>
      ) : (
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {Object.entries(problem).map(([key, value]) => (
            <li key={key} className="whitespace-pre-wrap wrap-anywhere">
              {key}: {typeof value === "string" ? value : JSON.stringify(value)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
