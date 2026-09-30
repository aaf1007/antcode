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
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/70">
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
          <DescriptionContent text={problem.contentText ?? "No description is available."} />
        </section>
      )}

      <section aria-labelledby="problem-example" className="mt-7">
        <h2 id="problem-example" className="font-heading text-lg font-semibold">Sample test case</h2>
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

function DescriptionContent({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const groups: string[][] = [];

  for (const block of blocks) {
    const previous = groups[groups.length - 1];
    if (block.startsWith("- ") && previous?.[0].startsWith("- ")) previous.push(block);
    else groups.push([block]);
  }

  return (
    <div className="space-y-5 text-base leading-7 text-ink">
      {groups.map((group, index) => {
        const block = group[0];
        if (/^Example\s+\d+:$/i.test(block)) {
          return <h2 key={index} className="border-line border-t pt-5 font-heading text-lg font-semibold">{block}</h2>;
        }

        if (/^Constraints:$/i.test(block)) {
          return <h2 key={index} className="border-line border-t pt-5 font-heading text-lg font-semibold">Constraints</h2>;
        }

        if (/^Follow-up:\s*/i.test(block)) {
          return <aside key={index} className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3"><strong className="font-semibold">Follow-up</strong><p className="mt-1">{block.replace(/^Follow-up:\s*/i, "")}</p></aside>;
        }

        if (/^(?:Input|Output|Explanation):/i.test(block)) {
          return (
            <div key={index} className="space-y-2 rounded-lg border border-line bg-canvas px-4 py-3">
              {block.split("\n").map((line, lineIndex) => {
                const match = /^(Input|Output|Explanation):\s*(.*)$/i.exec(line);
                if (!match) return <p key={lineIndex} className="whitespace-pre-wrap">{line}</p>;
                return <p key={lineIndex} className="whitespace-pre-wrap"><strong className="font-semibold">{match[1]}:</strong> <span className={match[1].toLowerCase() === "explanation" ? "" : "font-code text-[0.9em]"}>{match[2]}</span></p>;
              })}
            </div>
          );
        }

        if (block.startsWith("- ")) {
          return <ul key={index} className="list-disc space-y-2 pl-6">{group.map((item, itemIndex) => <li key={itemIndex}>{item.slice(2)}</li>)}</ul>;
        }

        return <p key={index} className="whitespace-pre-wrap">{block}</p>;
      })}
    </div>
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
