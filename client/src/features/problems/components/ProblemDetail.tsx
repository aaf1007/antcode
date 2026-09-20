import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { problemQueries } from "../problem.queries";

export default function ProblemDetail({ problemId }: { problemId: string }) {
  const { data: problem, isPending, isError, error, refetch } = useQuery(
    problemQueries.detail(problemId),
  );

  return (
    <>
      <Link to="/problem" className="text-accent-text hover:underline">
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
        <article className="mt-6 space-y-6">
          <header>
            <p className="text-sm text-ink/60">
              {problem.category} · {problem.difficulty} · {problem.acRate.toFixed(1)}% accepted
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-ink">
              {problem.frontendId}. {problem.title}
            </h1>
            <a
              href={problem.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-accent-text hover:underline"
            >
              View original problem
            </a>
          </header>

          {problem.isPremium ? (
            <p>This is a premium problem, so its description is unavailable.</p>
          ) : (
            <section aria-labelledby="problem-description">
              <h2 id="problem-description" className="text-xl font-medium">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-ink/80">
                {problem.contentText ?? "No description is available."}
              </p>
            </section>
          )}

          <section aria-labelledby="problem-example">
            <h2 id="problem-example" className="text-xl font-medium">Example input</h2>
            <pre className="mt-2 overflow-x-auto rounded-md bg-surface p-4 whitespace-pre-wrap">
              {problem.exampleInputFirst || "No example input is available."}
            </pre>
          </section>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Likes" value={problem.likes} />
            <Stat label="Dislikes" value={problem.dislikes} />
            <Stat label="Accepted" value={problem.totalAccepted} />
            <Stat label="Submissions" value={problem.totalSubmitted} />
          </dl>
        </article>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line p-3">
      <dt className="text-ink/60">{label}</dt>
      <dd className="mt-1 font-medium tabular-nums">{value.toLocaleString()}</dd>
    </div>
  );
}
