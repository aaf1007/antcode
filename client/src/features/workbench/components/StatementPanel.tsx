import { Link } from "react-router";
import type { ProblemItem } from "@/features/problems/problem.types";

export function StatementPanel({ problem }: { problem: ProblemItem }) {
  return (
    <article className="h-full overflow-y-auto px-5 py-6 lg:px-7">
      <Link to="/problem" className="text-sm text-accent-text hover:underline">← Back to problems</Link>
      <header className="mt-5">
        <p className="text-sm text-ink/60">
          {problem.category} · <span className={difficultyClass(problem.difficulty)}>{problem.difficulty}</span> · {problem.acRate.toFixed(1)}% accepted
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-ink">
          {problem.frontendId}. {problem.title}
        </h1>
      </header>

      {problem.isPremium ? (
        <p className="mt-6">This is a premium problem, so its description is unavailable.</p>
      ) : (
        <section aria-labelledby="problem-description" className="mt-7">
          <h2 id="problem-description" className="font-heading text-lg font-semibold">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/80">
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
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-line p-3"><dt className="text-ink/60">{label}</dt><dd className="mt-1 font-semibold tabular-nums">{value.toLocaleString()}</dd></div>;
}

function difficultyClass(difficulty: ProblemItem["difficulty"]) {
  if (difficulty === "Easy") return "text-success";
  if (difficulty === "Medium") return "text-warning";
  return "text-danger";
}
