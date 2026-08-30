"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProblemPagination, ProblemSnippet } from "@/features/problems/problem.types";
import { ProblemCard } from "./ProblemCard";

export function ProblemList() {
  const [problems, setProblems] = useState<ProblemSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProblems = useCallback(async (): Promise<ProblemSnippet[]> => {
    const response = await fetch("/api/problem");

    if (!response.ok) {
      throw new Error("Could not fetch problems");
    }

    const data: ProblemPagination = await response.json();
    return data.problems;
  }, []);

  useEffect(() => {
    const loadInitialProblems = async () => {
      try {
        setProblems(await loadProblems());
      } catch {
        setError("We could not load problems right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialProblems();
  }, [loadProblems]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    void loadProblems()
      .then(setProblems)
      .catch(() => {
        setProblems([]);
        setError("We could not load problems right now. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[color:var(--border)] bg-white px-5 py-10 text-center shadow-sm" role="status">
        <p className="font-medium text-[color:var(--text-h)]">Loading problems…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
        <p className="font-medium text-rose-800">{error}</p>
        <button
          className="mt-4 rounded-md bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#8d20df] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
          onClick={handleRefresh}
          type="button"
        >
          Refresh problems
        </button>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-white px-5 py-10 text-center">
        <p className="font-medium text-[color:var(--text-h)]">No problems are available yet.</p>
        <button
          className="mt-4 rounded-md border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--text-h)] outline-none transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
          onClick={handleRefresh}
          type="button"
        >
          Refresh problems
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[color:var(--text)]">
          {problems.length} {problems.length === 1 ? "problem" : "problems"} ready to practice
        </p>
        <button
          className="rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-semibold text-[color:var(--text-h)] outline-none transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
          onClick={handleRefresh}
          type="button"
        >
          Refresh problems
        </button>
      </div>
      <ul className="grid gap-4" aria-label="Practice problems">
        {problems.map((problem) => (
          <ProblemCard key={problem.questionId} problem={problem} />
        ))}
      </ul>
    </div>
  );
}
