import { lazy, Suspense, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { problemQueries } from "../problem.queries";

const Workbench = lazy(() => import("@/features/workbench/components/Workbench"));

export default function ProblemDetail({ slug }: { slug: string }) {
  const { data, isPending, isError, error, refetch } = useQuery(
    problemQueries.detail(slug),
  );
  let content: ReactNode;

  if (isPending) {
    content = <main className="mx-auto max-w-5xl px-4 py-8"><p role="status">Loading problem…</p></main>;
  } else if (isError) {
    content = (
      <main className="mx-auto max-w-5xl px-4 py-8" role="alert">
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
  } else if (data === null) {
    content = <main className="mx-auto max-w-5xl px-4 py-8"><p>Problem not found.</p></main>;
  } else {
    content = (
      <Suspense fallback={<main className="mx-auto max-w-5xl px-4 py-8"><p role="status">Preparing workbench…</p></main>}>
        <Workbench key={data.problem.problemId} data={data} />
      </Suspense>
    );
  }

  return content;
}
