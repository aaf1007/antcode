"use client";

import type { ProblemPagination, ProblemSnippet } from "@/features/problems/problem.types";
import { useCallback, useEffect, useState } from "react";
import { ProblemCard } from "./ProblemCard";
    
export function ProblemList() {
  const [problems, setProblems] = useState<ProblemSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProblems = useCallback(async () => {
    try {
      const response = await fetch("/api/problem");

      if (!response.ok) {
        throw new Error("Could not fetch problems");
      }

      const data: ProblemPagination = await response.json();
      setProblems(data.problems);
    } catch {
      setProblems([]);
      setError("We could not load problems right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialProblems = async () => {
      await loadProblems();
    };

    void loadInitialProblems();
  }, [loadProblems]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    void loadProblems();
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm px-5 py-10 border border-[color:var(--border)] rounded-xl text-center" role="status">
        <p className="font-medium text-[color:var(--text-h)]">Loading problems…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 px-5 py-8 border border-rose-200 rounded-xl text-center">
        <p className="font-medium text-rose-800">{error}</p>
        <button
          className="bg-[color:var(--accent)] hover:bg-[#8d20df] mt-4 px-4 py-2 rounded-md outline-none focus-visible:ring-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-offset-2 font-semibold text-white text-sm transition-colors"
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
      <div className="bg-white px-5 py-10 border border-[color:var(--border)] border-dashed rounded-xl text-center">
        <p className="font-medium text-[color:var(--text-h)]">No problems are available yet.</p>
        <button
          className="mt-4 px-4 py-2 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] rounded-md outline-none focus-visible:ring-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-offset-2 font-semibold text-[color:var(--text-h)] hover:text-[color:var(--accent)] text-sm transition-colors"
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
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <p className="text-[color:var(--text)] text-sm">
          {problems.length} {problems.length === 1 ? "problem" : "problems"} ready to practice
        </p>
        <button
          className="px-3 py-2 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] rounded-md outline-none focus-visible:ring-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-offset-2 font-semibold text-[color:var(--text-h)] hover:text-[color:var(--accent)] text-sm transition-colors"
          onClick={handleRefresh}
          type="button"
        >
          Refresh problems
        </button>
      </div>
      <ul className="gap-4 grid" aria-label="Practice problems">
        {problems.map((problem) => (
          <ProblemCard key={problem.questionId} problem={problem} />
        ))}
      </ul>
    </div>
  );
}
