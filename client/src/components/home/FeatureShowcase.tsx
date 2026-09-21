import { Icon } from "@/components/ui/Icon";

const foundationTopics = ["Arrays", "Two Pointers", "Sliding Window"];
const sessionItems = [
  { label: "Read the constraints", done: true },
  { label: "Name the pattern", done: true },
  { label: "Explain the trade-off", done: false },
];

export function FeatureShowcase() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-[120px] pb-16 min-[640px]:pb-22 min-[1024px]:pb-28">
      <div className="mb-8 max-w-[680px] min-[640px]:mb-10">
        <p className="font-code text-[10px] tracking-[0.14em] text-accent-text min-[640px]:text-[11px]">BUILT FOR CLARITY</p>
        <h2 id="features-heading" className="mt-4 font-heading text-[clamp(36px,7vw,58px)] leading-[1.04] font-bold tracking-[-0.02em]">
          Less noise. More useful practice.
        </h2>
      </div>

      <div className="grid gap-3.5 min-[768px]:grid-cols-2">
        <article className="relative overflow-hidden rounded-[22px] border border-line bg-surface p-6 shadow-[inset_0_1px_0_var(--color-highlight)] min-[640px]:p-8 min-[768px]:row-span-2">
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-accent/12 blur-3xl" aria-hidden="true" />
          <span className="relative grid size-11 place-items-center rounded-[12px] border border-node-line bg-node text-accent-text"><Icon name="route" /></span>
          <h3 className="relative mt-7 max-w-[420px] font-heading text-[28px] leading-[1.08] font-semibold min-[640px]:text-[34px]">See the path, not just the next problem.</h3>
          <p className="relative mt-4 max-w-[450px] text-[15px] leading-[1.7] text-muted">A visual roadmap shows how foundational data structures lead into reusable techniques.</p>

          <div className="relative mt-10 rounded-[18px] border border-line bg-canvas/70 p-4 min-[640px]:mt-14 min-[640px]:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="font-code text-[10px] tracking-[0.1em] text-muted">FOUNDATION PATH</span>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 font-code text-[9px] text-accent-text">3 TOPICS</span>
            </div>
            <ol className="space-y-2.5">
              {foundationTopics.map((topic, index) => (
                <li key={topic} className="flex items-center gap-3 rounded-[12px] border border-line bg-surface p-3.5 shadow-[inset_0_1px_0_var(--color-highlight)]">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full font-code text-[10px] ${index === 0 ? "bg-accent text-primary" : "border border-node-line bg-node text-accent-text"}`}>{index + 1}</span>
                  <span className="font-heading text-[16px] font-semibold">{topic}</span>
                  {index < foundationTopics.length - 1 && <Icon name="arrow" width="15" height="15" className="ml-auto text-muted" />}
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="rounded-[22px] border border-line bg-surface p-6 shadow-[inset_0_1px_0_var(--color-highlight)] min-[640px]:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-node-line bg-node text-accent-text"><Icon name="focus" /></span>
            <div>
              <h3 className="font-heading text-[25px] leading-[1.1] font-semibold">One focused session</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-muted min-[640px]:text-[15px]">Use a simple mental checklist to get more from every problem.</p>
            </div>
          </div>
          <ul className="mt-7 space-y-3" aria-label="Example practice checklist">
            {sessionItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[13px] text-muted min-[640px]:text-[14px]">
                <span className={`grid size-5 shrink-0 place-items-center rounded-full ${item.done ? "bg-success/14 text-success" : "border border-line text-muted"}`}>
                  {item.done ? <Icon name="check" width="12" height="12" /> : <span className="size-1 rounded-full bg-muted" />}
                </span>
                <span className={item.done ? "text-ink" : ""}>{item.label}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-primary bg-primary p-6 text-white shadow-[0_20px_55px_-35px_rgba(27,31,59,0.65)] min-[640px]:p-8 dark:border-node-line">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-code text-[9px] tracking-[0.13em] text-white/55">PATTERN OVER MEMORIZATION</p>
              <h3 className="mt-3 font-heading text-[25px] leading-[1.1] font-semibold">Learn the idea behind the answer.</h3>
            </div>
            <span className="hidden size-11 shrink-0 place-items-center rounded-[12px] border border-white/12 bg-white/7 text-accent min-[400px]:grid"><Icon name="code" /></span>
          </div>
          <div className="mt-7 overflow-hidden rounded-[13px] border border-white/10 bg-black/18 font-code text-[11px] leading-[1.8] text-white/62">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3"><span className="size-1.5 rounded-full bg-white/20" /><span className="size-1.5 rounded-full bg-white/20" /><span className="size-1.5 rounded-full bg-white/20" /><span className="ml-auto text-[9px] tracking-[0.1em]">APPROACH.TS</span></div>
            <pre className="overflow-x-auto p-4"><code><span className="text-accent">while</span>{" (right < values.length) {\n  window.add(values[right]);\n  "}<span className="text-accent">if</span>{" (window.isValid) best++;\n}"}</code></pre>
          </div>
        </article>
      </div>
    </section>
  );
}
