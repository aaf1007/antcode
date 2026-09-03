import type { Difficulty, ProblemSnippet } from "@/features/problems/problem.types";

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success ring-success/20",
  Medium: "bg-warning/10 text-warning ring-warning/20",
  Hard: "bg-danger/10 text-danger ring-danger/20",
};

type ProblemCardProps = {
  problem: ProblemSnippet;
};

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <li className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <article aria-labelledby={`problem-${problem.questionId}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink/70">
              Problem {problem.questionId}
            </p>
            <h3
              id={`problem-${problem.questionId}`}
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Topics
            </p>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${problem.title} topics`}>
              {problem.topicTags.map((tag) => (
                <li
                  key={tag.slug}
                  className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-text"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
          <dl className="shrink-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Acceptance
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {problem.acRate}%
            </dd>
          </dl>
        </div>
      </article>
    </li>
  );
}
