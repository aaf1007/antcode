import { Icon } from "@/components/ui/Icon";
import { Link } from "react-router";

const topics = [
  { name: "Arrays", position: "col-start-3 row-start-1", label: "Foundation" },
  { name: "Two Pointers", position: "col-start-2 row-start-2", label: "Technique" },
  { name: "Stack", position: "col-start-4 row-start-2", label: "Structure" },
  { name: "Linked List", position: "col-start-1 row-start-3", label: "Structure" },
  { name: "Binary Search", position: "col-start-3 row-start-3", label: "Technique" },
  { name: "Sliding Window", position: "col-start-5 row-start-3", label: "Technique" },
  { name: "Trees", position: "col-start-3 row-start-4", label: "Structure" },
  { name: "Tries", position: "col-start-1 row-start-5", label: "Structure" },
  { name: "Heap", position: "col-start-3 row-start-5", label: "Structure" },
  { name: "Backtracking", position: "col-start-5 row-start-5", label: "Technique" },
];

const pathItems = [
  { label: "Learning path", icon: "route" as const, active: true },
  { label: "Topic map", icon: "map" as const },
  { label: "Practice", icon: "code" as const },
];

export function LearningRoadmap() {
  return (
    <figure id="roadmap" aria-labelledby="roadmap-caption" className="w-full scroll-mt-[120px]">
      <div className="relative overflow-hidden rounded-[22px] border border-line bg-surface p-2 shadow-[0_40px_100px_-52px_rgba(27,31,59,0.5),inset_0_1px_0_var(--color-highlight)] min-[640px]:rounded-[28px] min-[640px]:p-3">
        <div className="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-accent/12 blur-3xl" aria-hidden="true" />
        <div className="relative flex min-h-11 items-center gap-2 px-3 min-[640px]:min-h-13 min-[640px]:px-4">
          <span className="size-2 rounded-full bg-danger/55" />
          <span className="size-2 rounded-full bg-warning/55" />
          <span className="size-2 rounded-full bg-success/55" />
          <span className="ml-2 font-code text-[8px] tracking-[0.13em] text-muted min-[400px]:text-[9px]">ANTCODE / LEARNING PATH</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2 py-1 font-code text-[8px] text-muted min-[640px]:px-2.5">
            <span className="size-1.5 rounded-full bg-success" /> LIVE
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[16px] border border-line bg-canvas/75 min-[640px]:rounded-[20px] min-[1024px]:grid min-[1024px]:grid-cols-[180px_minmax(0,1fr)_210px]">
          <aside className="hidden border-r border-line bg-surface/55 p-4 min-[1024px]:flex min-[1024px]:flex-col" aria-label="Product preview navigation">
            <p className="px-2 pt-2 font-code text-[8px] tracking-[0.13em] text-muted">WORKSPACE</p>
            <ul className="mt-3 space-y-1">
              {pathItems.map((item) => (
                <li key={item.label} className={`flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-[11px] ${item.active ? "border border-node-line bg-node font-medium text-ink shadow-[inset_0_1px_0_var(--color-highlight)]" : "text-muted"}`}>
                  <Icon name={item.icon} width="15" height="15" className={item.active ? "text-accent-text" : ""} />
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-[12px] border border-line bg-surface p-3">
              <span className="grid size-7 place-items-center rounded-[8px] bg-node text-accent-text"><Icon name="focus" width="14" height="14" /></span>
              <p className="mt-3 font-heading text-[11px] font-semibold">Stay pattern-first</p>
              <p className="mt-1 text-[9px] leading-[1.5] text-muted">Build reusable thinking, not memorized answers.</p>
            </div>
          </aside>

          <div className="min-w-0 p-3 min-[400px]:p-4 min-[640px]:p-6 min-[1024px]:p-7">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-code text-[8px] tracking-[0.12em] text-accent-text">ROADMAP</p>
                <h2 className="mt-1.5 font-heading text-[17px] font-semibold min-[640px]:text-[20px]">Core interview patterns</h2>
              </div>
              <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-code text-[8px] text-muted">10 TOPICS</span>
            </div>
            <div className="relative aspect-[540/430] min-[1024px]:aspect-[540/390]">
              <svg className="absolute inset-0 size-full stroke-connector stroke-[1.5]" viewBox="0 0 540 478" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M270 70v6q0 10-10 10h-72q-10 0-10 10v6m92-26q0 10 10 10h72q10 0 10 10v6" />
                <path d="M178 172v6q0 10-10 10H96q-10 0-10 10v6m92-26q0 10 10 10h72q10 0 10 10v6m92-32v6q0 10 10 10h72q10 0 10 10v6" />
                <path d="M86 274v6q0 10 10 10h164q10 0 10 10v6m0-32v32m184-32v6q0 10-10 10H280q-10 0-10 10" />
                <path d="M270 376v6q0 10-10 10H96q-10 0-10 10v6m184-26v26m0-26q0 10 10 10h164q10 0 10 10v6" />
              </svg>
              <ol className="absolute inset-0 grid grid-cols-6 grid-rows-[repeat(5,1fr)] gap-x-[2.2222%] gap-y-[6.6946%]" aria-label="Algorithm topics, from foundations to advanced patterns">
                {topics.map((topic) => (
                  <li key={topic.name} className={`col-span-2 flex flex-col items-center justify-center gap-[3px] rounded-[8px] border border-node-line bg-node px-1 text-center font-heading text-[clamp(8px,2.9vw,14px)] leading-[1.08] font-semibold whitespace-normal shadow-[0_4px_12px_#00000008,inset_0_1px_0_var(--color-highlight)] first:border-accent min-[400px]:rounded-[10px] min-[640px]:gap-[5px] min-[640px]:rounded-[12px] min-[640px]:text-[15px] min-[1024px]:text-[clamp(10px,1.05vw,14px)] ${topic.position}`}>
                    <span className="max-w-full">{topic.name}</span>
                    <span className="hidden font-body text-[7px] leading-[1.1] font-normal tracking-normal text-accent-text min-[400px]:block min-[640px]:text-[8px]">{topic.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="hidden border-l border-line bg-surface/55 p-4 min-[1024px]:block" aria-label="Suggested practice preview">
            <p className="px-1 pt-2 font-code text-[8px] tracking-[0.13em] text-muted">SUGGESTED NEXT</p>
            <div className="mt-3 rounded-[14px] border border-line bg-surface p-4 shadow-[inset_0_1px_0_var(--color-highlight)]">
              <div className="flex items-center justify-between gap-2">
                <span className="grid size-8 place-items-center rounded-[9px] border border-node-line bg-node text-accent-text"><Icon name="code" width="15" height="15" /></span>
                <span className="rounded-full bg-success/12 px-2 py-1 font-code text-[7px] tracking-[0.08em] text-success">EASY</span>
              </div>
              <h3 className="mt-5 font-heading text-[16px] font-semibold">Two Sum</h3>
              <p className="mt-1.5 text-[10px] leading-[1.5] text-muted">Arrays · Hash map</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="font-code text-[7px] tracking-[0.1em] text-muted">YOU'LL PRACTICE</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-node px-2 py-1 text-[8px] text-accent-text">Lookup</span>
                  <span className="rounded-md bg-node px-2 py-1 text-[8px] text-accent-text">Trade-offs</span>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-[14px] border border-primary bg-primary p-4 text-white dark:border-node-line">
              <p className="font-code text-[7px] tracking-[0.1em] text-accent">PRACTICE PRINCIPLE</p>
              <p className="mt-2 font-heading text-[13px] leading-[1.35] font-semibold">Explain the pattern before you write the code.</p>
            </div>
          </aside>
        </div>
      </div>
      <figcaption id="roadmap-caption" className="mt-4 flex justify-center text-center">
        <Link to="/roadmap" className="group inline-flex items-center gap-2 text-[10px] text-muted transition-colors hover:text-ink min-[640px]:text-[11px]">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Explore the full learning roadmap
          <Icon name="arrow" width="13" height="13" className="text-accent-text transition-transform group-hover:translate-x-0.5" />
        </Link>
      </figcaption>
    </figure>
  );
}
