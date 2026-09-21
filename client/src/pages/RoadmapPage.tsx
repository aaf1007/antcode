import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Icon } from "@/components/ui/Icon";
import { PrimaryLink } from "@/components/ui/PrimaryLink";

const stages = [
  {
    number: "01",
    title: "Foundations",
    description: "Build the core ways of organizing and scanning data.",
    problemCount: 34,
    topics: [
      { name: "Arrays & Hashing", count: 9 },
      { name: "Two Pointers", count: 5 },
      { name: "Sliding Window", count: 6 },
      { name: "Stack", count: 7 },
      { name: "Binary Search", count: 7 },
    ],
  },
  {
    number: "02",
    title: "Core structures",
    description: "Learn the structures that make relationships and priority explicit.",
    problemCount: 36,
    topics: [
      { name: "Linked List", count: 11 },
      { name: "Trees", count: 15 },
      { name: "Tries", count: 3 },
      { name: "Heap / Priority Queue", count: 7 },
    ],
  },
  {
    number: "03",
    title: "Search & graphs",
    description: "Explore choices, model connections, and traverse complex state.",
    problemCount: 28,
    topics: [
      { name: "Backtracking", count: 9 },
      { name: "Graphs", count: 13 },
      { name: "Advanced Graphs", count: 6 },
    ],
  },
  {
    number: "04",
    title: "Optimization",
    description: "Turn repeated work into reusable state and sharpen problem-solving range.",
    problemCount: 52,
    topics: [
      { name: "1-D Dynamic Programming", count: 12 },
      { name: "2-D Dynamic Programming", count: 11 },
      { name: "Greedy", count: 8 },
      { name: "Intervals", count: 6 },
      { name: "Math & Geometry", count: 8 },
      { name: "Bit Manipulation", count: 7 },
    ],
  },
] as const;

const summary = [
  { value: "4", label: "stages" },
  { value: "18", label: "topics" },
  { value: "150", label: "problems" },
] as const;

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 min-[640px]:px-8 min-[1200px]:px-5">
      <main>
        <section id="learning-path" aria-labelledby="roadmap-heading" className="pt-12 pb-16 min-[640px]:pt-16 min-[640px]:pb-22">
          <header className="grid gap-8 border-b border-line pb-10 min-[640px]:pb-12 min-[900px]:grid-cols-[minmax(0,1fr)_420px] min-[900px]:items-end min-[900px]:gap-12">
            <div className="max-w-[690px]">
              <p className="font-code text-[10px] tracking-[0.14em] text-accent-text">THE ANTCODE ROADMAP</p>
              <h1 id="roadmap-heading" className="mt-3 font-heading text-[clamp(36px,6vw,56px)] leading-[1.05] font-bold tracking-[-0.035em]">Build depth in the right order.</h1>
              <p className="mt-4 text-[15px] leading-[1.7] text-muted min-[640px]:text-[17px]">Each stage builds on the last, moving from everyday data patterns to the techniques that make larger search spaces manageable.</p>
            </div>

            <dl className="grid grid-cols-3 overflow-hidden rounded-[16px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)]">
              {summary.map((item, index) => (
                <div key={item.label} className={`flex flex-col px-2 py-4 text-center min-[400px]:px-4 ${index > 0 ? "border-l border-line" : ""}`}>
                  <dt className="mt-1.5 font-code text-[8px] tracking-[0.1em] text-muted uppercase min-[400px]:text-[9px]">{item.label}</dt>
                  <dd className="order-first font-heading text-[24px] leading-none font-bold text-ink min-[640px]:text-[28px]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="relative mt-10 min-[640px]:mt-14">
            <div className="absolute top-5 bottom-5 left-[17px] w-px bg-line min-[640px]:left-[23px]" aria-hidden="true" />
            <ol className="space-y-6 min-[640px]:space-y-8">
            {stages.map((stage) => (
              <li key={stage.number} className="relative pl-12 min-[640px]:pl-18">
                <span className="absolute top-0 left-0 z-10 grid size-9 place-items-center rounded-full border border-node-line bg-node font-code text-[9px] font-semibold text-accent-text shadow-[inset_0_1px_0_var(--color-highlight)] min-[640px]:size-12 min-[640px]:text-[10px]" aria-hidden="true">{stage.number}</span>
                <article className="rounded-[20px] border border-line bg-surface p-5 shadow-[0_18px_55px_-44px_rgba(27,31,59,0.6),inset_0_1px_0_var(--color-highlight)] min-[640px]:rounded-[24px] min-[640px]:p-7 min-[1024px]:p-8">
                  <header className="flex flex-col gap-4 border-b border-line pb-5 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between min-[640px]:gap-8 min-[640px]:pb-6">
                    <div>
                      <p className="font-code text-[9px] tracking-[0.12em] text-accent-text">STAGE {stage.number}</p>
                      <h3 className="mt-2 font-heading text-[clamp(25px,4vw,34px)] leading-tight font-bold tracking-[-0.02em]">{stage.title}</h3>
                      <p className="mt-3 max-w-[650px] text-[14px] leading-[1.65] text-muted min-[640px]:text-[15px]">{stage.description}</p>
                    </div>
                    <p className="shrink-0 self-start rounded-full border border-node-line bg-node px-3 py-2 font-code text-[9px] tracking-[0.08em] text-accent-text">{stage.problemCount} PROBLEMS</p>
                  </header>

                  <ul className="mt-5 grid gap-2.5 min-[480px]:grid-cols-2 min-[900px]:grid-cols-3 min-[640px]:mt-6 min-[640px]:gap-3">
                    {stage.topics.map((topic) => (
                      <li key={topic.name} className="flex min-h-20 items-center justify-between gap-3 rounded-[13px] border border-node-line bg-node px-4 py-3 shadow-[inset_0_1px_0_var(--color-highlight)]">
                        <span className="font-heading text-[14px] leading-[1.3] font-semibold">{topic.name}</span>
                        <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 font-code text-[9px] text-muted" aria-label={`${topic.count} problems`}>{topic.count}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
          </div>
        </section>

        <section aria-labelledby="roadmap-usage-heading" className="pb-8 min-[640px]:pb-10">
          <div className="rounded-[20px] border border-node-line bg-node px-5 py-6 min-[640px]:flex min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-8 min-[640px]:px-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-accent-text"><Icon name="route" width="18" height="18" /></span>
              <h2 id="roadmap-usage-heading" className="font-heading text-[18px] font-semibold">How to use this roadmap</h2>
            </div>
            <p className="mt-4 font-code text-[10px] leading-[1.8] tracking-[0.04em] text-muted min-[640px]:mt-0 min-[640px]:text-right min-[640px]:text-[11px]">Learn the pattern → Solve a focused set → Explain the trade-offs</p>
          </div>
        </section>

        <section aria-labelledby="roadmap-cta-heading" className="pb-16 min-[640px]:pb-22">
          <div className="relative isolate overflow-hidden rounded-[24px] border border-primary bg-primary px-6 py-11 text-center text-white shadow-[0_24px_70px_-42px_rgba(27,31,59,0.7)] min-[640px]:px-10 min-[640px]:py-14 dark:border-node-line">
            <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(var(--color-accent)_1px,transparent_1px),linear-gradient(90deg,var(--color-accent)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" aria-hidden="true" />
            <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[70%] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
            <h2 id="roadmap-cta-heading" className="mx-auto max-w-[680px] font-heading text-[clamp(32px,6vw,50px)] leading-[1.05] font-bold tracking-[-0.025em]">Ready to put the roadmap into practice?</h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.7] text-white/65 min-[640px]:text-[16px]">Start with the first problem, then keep moving with purpose.</p>
            <div className="mt-7 flex justify-center">
              <PrimaryLink to="/problem" className="border-white/10 shadow-[0_8px_24px_#00000030]">Browse problems<Icon name="arrow" /></PrimaryLink>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
