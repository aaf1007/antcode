import type { ProblemItem } from "@/features/problems/problem.types";
import { Icon } from "@/components/ui/Icon";

export function StatementPanel({ problem }: { problem: ProblemItem }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-10 shrink-0 items-center gap-2 border-line border-b px-4 text-sm font-semibold">
        <Icon name="layers" width="16" height="16" className="text-accent-text" />
        Description
      </div>
      <article className="min-h-0 flex-1 overflow-y-auto px-5 py-6 lg:px-7">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          {problem.frontendId}. {problem.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink/60">
          <span className={`rounded-full px-2 py-1 font-semibold ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
          <span>{problem.category}</span>
          <span aria-hidden="true">·</span>
          <span>{problem.acRate.toFixed(1)}% accepted</span>
        </p>
      </header>

      {problem.isPremium ? (
        <p className="mt-6">This is a premium problem, so its description is unavailable.</p>
      ) : (
        <section aria-label="Problem description" className="mt-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink/80">
            {problem.contentText ?? "No description is available."}
          </p>
        </section>
      )}

      <section aria-labelledby="problem-example" className="mt-7">
        <h2 id="problem-example" className="font-heading text-lg font-semibold">Example input</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-highlight p-4 font-code text-sm whitespace-pre-wrap">
          {problem.exampleInputFirst || "No example input is available."}
        </pre>
      </section>

      <dl className="mt-7 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Likes" value={problem.likes} />
        <Stat label="Dislikes" value={problem.dislikes} />
        <Stat label="Accepted" value={problem.totalAccepted} />
        <Stat label="Submissions" value={problem.totalSubmitted} />
      </dl>

      <a href={problem.url} target="_blank" rel="noreferrer" className="mt-7 inline-block text-sm font-semibold text-accent-text hover:underline">
        View original problem ↗
      </a>
      </article>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-line p-3"><dt className="text-ink/60">{label}</dt><dd className="mt-1 font-semibold tabular-nums">{value.toLocaleString()}</dd></div>;
}

function difficultyClass(difficulty: ProblemItem["difficulty"]) {
  if (difficulty === "Easy") return "bg-success/10 text-success";
  if (difficulty === "Medium") return "bg-warning/10 text-warning";
  return "bg-danger/10 text-danger";
}
