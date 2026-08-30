import type { Difficulty, ProblemSnippet } from "@/features/problems/problem.types";

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Hard: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

type ProblemCardProps = {
  problem: ProblemSnippet;
};

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <li className="rounded-xl border border-[color:var(--border)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <article aria-labelledby={`problem-${problem.questionId}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[color:var(--text)]">
              Problem {problem.questionId}
            </p>
            <h3
              id={`problem-${problem.questionId}`}
              className="mt-1 text-lg font-semibold text-[color:var(--text-h)]"
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
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text)]">
              Topics
            </p>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${problem.title} topics`}>
              {problem.topicTags.map((tag) => (
                <li
                  key={tag.slug}
                  className="rounded-md bg-[color:var(--accent-bg)] px-2.5 py-1 text-xs font-medium text-[color:var(--accent)]"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
          <dl className="shrink-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text)]">
              Acceptance
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[color:var(--text-h)]">
              {problem.acRate}%
            </dd>
          </dl>
        </div>
      </article>
    </li>
  );
}
