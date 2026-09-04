import type { Difficulty, ProblemListItem } from "@/features/problems/problem.types";

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success ring-success/20",
  Medium: "bg-warning/10 text-warning ring-warning/20",
  Hard: "bg-danger/10 text-danger ring-danger/20",
};

type ProblemCardProps = {
  problem: ProblemListItem;
};

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <li className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <article aria-labelledby={`problem-${problem.problemId}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink/70">
              Problem {problem.frontendId}
            </p>
            <h3
              id={`problem-${problem.problemId}`}
              className="mt-1 text-lg font-semibold text-ink"
            >
              {problem.title}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${difficultyClasses[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-text">
              {problem.category}
            </span>
            {/* Premium problems ship as metadata-only stubs — no body, no
                snippets, no test cases. The badge is the reader's warning that
                opening this one gets them a title and not much else. */}
            {problem.isPremium ? (
              <span className="rounded-md bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning ring-1 ring-inset ring-warning/20">
                Premium
              </span>
            ) : null}
            <a
              href={problem.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-medium text-accent-text underline underline-offset-2 hover:text-ink"
            >
              LeetCode
            </a>
          </div>
          <dl className="shrink-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Acceptance
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {problem.acRate.toFixed(1)}%
            </dd>
          </dl>
        </div>
      </article>
    </li>
  );
}
