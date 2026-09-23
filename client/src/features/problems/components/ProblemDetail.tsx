import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { problemQueries } from "../problem.queries";

const Workbench = lazy(() => import("@/features/workbench/components/Workbench"));

export default function ProblemDetail({ slug }: { slug: string }) {
  const { data, isPending, isError, error, refetch } = useQuery(
    problemQueries.detail(slug),
  );

  if (isPending) {
    return <main className="mx-auto max-w-5xl px-4 py-8"><p role="status">Loading problem…</p></main>;
  }
  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8" role="alert">
        <Link to="/problem" className="text-accent-text hover:underline">← Back to problems</Link>
          <p className="text-danger">{error.message}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-accent-text hover:underline"
          >
            Retry
          </button>
      </main>
    );
  }
  if (data === null) {
    return <main className="mx-auto max-w-5xl px-4 py-8"><Link to="/problem" className="text-accent-text hover:underline">← Back to problems</Link><p className="mt-4">Problem not found.</p></main>;
  }

  return <Suspense fallback={<main className="mx-auto max-w-5xl px-4 py-8"><p role="status">Preparing workbench…</p></main>}><Workbench key={data.problem.problemId} data={data} /></Suspense>;
}
