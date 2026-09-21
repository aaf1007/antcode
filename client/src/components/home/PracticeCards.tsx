import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";

const starters = [
  {
    title: "Start with arrays",
    tag: "EASY",
    description: "First up: Two Sum",
    href: "https://leetcode.com/problems/two-sum/",
    icon: "layers" as const,
  },
  {
    title: "Train your stack",
    tag: "EASY",
    description: "Next up: Valid Parentheses",
    href: "https://leetcode.com/problems/valid-parentheses/",
    icon: "stack" as const,
  },
];

export function PracticeCards() {
  return (
    <section id="practice" aria-labelledby="practice-heading" className="scroll-mt-[120px] pb-16 min-[640px]:pb-22 min-[1024px]:pb-28">
      <div className="mb-7 flex flex-col gap-3 min-[640px]:mb-9 min-[640px]:flex-row min-[640px]:items-end min-[640px]:justify-between">
        <div>
          <p className="font-code text-[10px] tracking-[0.14em] text-accent-text min-[640px]:text-[11px]">PUT IT INTO PRACTICE</p>
          <h2 id="practice-heading" className="mt-3 font-heading text-[clamp(34px,6vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">Choose your next challenge.</h2>
        </div>
        <Link to="/problem" className="inline-flex min-h-10 items-center gap-2 self-start text-[13px] font-medium text-muted transition-colors hover:text-accent-text min-[640px]:self-auto">View all problems<Icon name="arrow" width="16" height="16" /></Link>
      </div>
      <div className="grid gap-3.5 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
        <Link to="/problem" className="group block overflow-hidden rounded-[18px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-accent-text hover:shadow-[0_18px_45px_-32px_rgba(27,31,59,0.4)]">
          <div className="flex min-h-32 items-start gap-4 p-5 min-[640px]:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] border border-node-line bg-node text-accent-text"><Icon name="code" /></span>
            <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-1 font-code text-[9px] tracking-[0.08em] text-accent-text">LIBRARY</span>
          </div>
          <div className="border-t border-line p-5 min-[640px]:p-6">
            <h3 className="font-heading text-[21px] font-semibold">Practice library</h3>
            <div className="mt-2 flex items-center justify-between gap-3 text-[13px] text-muted"><p>Find a problem. Find your rhythm.</p><Icon name="arrow" width="18" height="18" className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-accent-text" /></div>
          </div>
        </Link>

        {starters.map((starter) => (
          <a key={starter.title} href={starter.href} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-[18px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-accent-text hover:shadow-[0_18px_45px_-32px_rgba(27,31,59,0.4)]">
            <div className="flex min-h-32 items-start gap-4 p-5 min-[640px]:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-[11px] border border-node-line bg-node text-accent-text"><Icon name={starter.icon} /></span>
              <span className="ml-auto rounded-full bg-success/12 px-2.5 py-1 font-code text-[9px] tracking-[0.08em] text-success">{starter.tag}</span>
            </div>
            <div className="border-t border-line p-5 min-[640px]:p-6">
              <h3 className="font-heading text-[21px] font-semibold">{starter.title}</h3>
              <div className="mt-2 flex items-center justify-between gap-3 text-[13px] text-muted"><p>{starter.description}</p><Icon name="external" width="18" height="18" className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-accent-text" /></div>
            </div>
            <span className="sr-only">Opens on LeetCode in a new tab</span>
          </a>
        ))}
      </div>
    </section>
  );
}
