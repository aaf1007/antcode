import { useInfiniteQuery } from "@tanstack/react-query";
import { problemQueries } from "../problem.queries";
import { ProblemCard } from "./ProblemCard";

export default function ProblemList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery(problemQueries.catalog());

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <LoadingDots />
      </div>
    );
  }

  if (isError) {
    return <p className="text-danger text-sm">{error.message}</p>;
  }

  const problems = data.pages.flatMap((page) => page.problems);

  return (
    <>
      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <ul>
          {problems.map((problem) => (
            <ProblemCard key={problem.problemId} problem={problem} />
          ))}
        </ul>

        {isFetchingNextPage ? (
          <div className="flex justify-center py-4 text-ink/70 text-sm">
            <LoadingDots />
          </div>
        ) : null}

        {!hasNextPage ? (
          <p className="py-4 text-center text-ink/70 text-sm">End of the list.</p>
        ) : null}
      </div>

      {hasNextPage ? (
        <div className="flex justify-center py-15">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="inline-flex justify-center items-center hover:bg-ink/5 px-4 py-2 hover:border-ink/40 rounded-md focus:outline-none focus:ring-2 focus:ring-ink/20 font-medium text-sm transition-all duration-200 text-accent-text cursor-pointer"
          >
            Load More Problems
          </button>
        </div>
      ) : null}
    </>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
      <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
      <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
      <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
    </div>
  );
}
