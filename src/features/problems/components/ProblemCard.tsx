import type { Difficulty, ProblemListItem } from "@/features/problems/problem.types";

const difficultyLabel: Record<Difficulty, string> = {
  Easy: "Easy",
  Medium: "Med.",
  Hard: "Hard",
};

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-danger",
};

type ProblemCardProps = {
  problem: ProblemListItem;
};

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_5.5rem_4rem_1.5rem] items-center gap-4 px-4 py-3.5 text-sm odd:bg-surface even:bg-canvas hover:bg-line/60 transition-colors">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="inline-flex size-4 shrink-0 items-center justify-center"
          aria-hidden
        >
        </span>
        <a
          id={`problem-${problem.problemId}`}
          href={problem.url}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate text-[15px] text-ink hover:text-accent-text"
        >
          {problem.frontendId}. {problem.title}
        </a>
      </div>

      <span className="text-right tabular-nums text-ink/70">
        {problem.acRate.toFixed(1)}%
      </span>

      <span
        className={`text-right font-medium ${difficultyClasses[problem.difficulty]}`}
      >
        {difficultyLabel[problem.difficulty]}
      </span>

      <span className="flex justify-end text-ink/40" aria-label={problem.isPremium ? "Premium" : undefined}>
        {problem.isPremium ? <LockIcon /> : null}
      </span>
    </li>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
