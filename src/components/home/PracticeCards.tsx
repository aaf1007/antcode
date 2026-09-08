import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function PracticeCards() {
  return (
    <section id="practice" aria-labelledby="practice-heading" className="max-w-[900px] scroll-mt-[120px] pb-16 min-[1024px]:pb-[var(--home-space)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="practice-heading" className="font-code text-[10px] font-normal tracking-[0.12em] text-muted min-[640px]:text-[11px]">FIND YOUR NEXT CHALLENGE</h2>
        <Link href="/problem" className="hidden items-center gap-2 text-[12px] text-muted [&:hover]:text-accent-text min-[640px]:inline-flex min-[640px]:min-h-8">View all problems<Icon name="arrow" width="15" height="15" /></Link>
      </div>
      <div className="grid gap-3.5 min-[640px]:grid-cols-2">
        <Link href="/problem" className="group block overflow-hidden rounded-[15px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)] transition-[border-color,transform] duration-180 ease-[ease] [&:hover]:border-accent-text [&:hover]:[transform:translateY(-2px)]">
          <div className="flex items-center gap-3 px-4 py-4.5 min-[640px]:px-4.5 min-[1024px]:py-[clamp(10px,2svh,18px)]">
            <span className="grid size-8.5 shrink-0 place-items-center rounded-[10px] border border-node-line bg-node text-accent-text"><Icon name="code" /></span>
            <h3 className="font-heading text-[17px] font-semibold min-[640px]:text-[16px] min-[1024px]:text-[18px]">Practice library</h3>
            <span className="ml-auto font-code text-[10px] text-muted min-[640px]:hidden min-[1024px]:block">Explore</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line p-4 text-[12px] text-muted min-[640px]:px-4.5 min-[1024px]:py-[clamp(10px,1.8svh,16px)] min-[1024px]:text-[13px]"><p>Find a problem. Find your rhythm.</p><Icon name="arrow" width="18" height="18" className="shrink-0 transition-[transform] duration-180 ease-[ease] group-[:hover]:text-accent-text group-[:hover]:[transform:translateX(3px)]" /></div>
        </Link>
        <a href="https://leetcode.com/problems/two-sum/" target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-[15px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)] transition-[border-color,transform] duration-180 ease-[ease] [&:hover]:border-accent-text [&:hover]:[transform:translateY(-2px)]">
          <div className="flex items-center gap-3 px-4 py-4.5 min-[640px]:px-4.5 min-[1024px]:py-[clamp(10px,2svh,18px)]">
            <span className="grid size-8.5 shrink-0 place-items-center rounded-[10px] border border-node-line bg-node text-accent-text"><Icon name="layers" /></span>
            <h3 className="font-heading text-[17px] font-semibold min-[640px]:text-[16px] min-[1024px]:text-[18px]">Start with the basics</h3>
            <span className="ml-auto font-code text-[10px] text-muted min-[640px]:hidden min-[1024px]:block">Easy</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line p-4 text-[12px] text-muted min-[640px]:px-4.5 min-[1024px]:py-[clamp(10px,1.8svh,16px)] min-[1024px]:text-[13px]"><p><span className="mr-1.5">First up:</span> Two Sum</p><Icon name="external" width="18" height="18" className="shrink-0 transition-[transform] duration-180 ease-[ease] group-[:hover]:text-accent-text group-[:hover]:[transform:translateX(3px)]" /></div>
          <span className="sr-only">Opens on LeetCode in a new tab</span>
        </a>
      </div>
    </section>
  );
}
