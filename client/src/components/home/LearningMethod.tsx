import { Icon } from "@/components/ui/Icon";

const steps = [
  {
    number: "01",
    icon: "map" as const,
    title: "Orient",
    description: "Start with the map, so every topic has a reason and a place in your learning path.",
  },
  {
    number: "02",
    icon: "code" as const,
    title: "Practice",
    description: "Choose a focused problem and work the pattern until the approach feels natural.",
  },
  {
    number: "03",
    icon: "connect" as const,
    title: "Connect",
    description: "Relate each solution to the ideas around it instead of memorizing one-off answers.",
  },
];

export function LearningMethod() {
  return (
    <section id="method" aria-labelledby="method-heading" className="scroll-mt-[120px] py-16 min-[640px]:py-22 min-[1024px]:py-28">
      <div className="grid gap-8 min-[768px]:grid-cols-[0.85fr_1.15fr] min-[768px]:items-end min-[768px]:gap-16">
        <div>
          <p className="font-code text-[10px] tracking-[0.14em] text-accent-text min-[640px]:text-[11px]">A BETTER PRACTICE LOOP</p>
          <h2 id="method-heading" className="mt-4 max-w-[560px] font-heading text-[clamp(36px,7vw,58px)] leading-[1.02] font-bold tracking-[-0.02em]">
            From “I’ve seen it” to “I can solve it.”
          </h2>
        </div>
        <p className="max-w-[520px] text-[16px] leading-[1.75] text-muted min-[768px]:justify-self-end min-[768px]:pb-1 min-[1024px]:text-[17px]">
          Random problem lists create activity. A repeatable process creates understanding. AntCode keeps the next step visible, so your practice has direction.
        </p>
      </div>

      <ol className="mt-10 grid gap-3 min-[640px]:mt-12 min-[768px]:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="group relative overflow-hidden rounded-[20px] border border-line bg-surface p-6 shadow-[inset_0_1px_0_var(--color-highlight)] transition-[transform,border-color,box-shadow] duration-200 [&:hover]:-translate-y-1 [&:hover]:border-node-line [&:hover]:shadow-[0_18px_50px_-32px_rgba(27,31,59,0.35)] min-[1024px]:p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-[12px] border border-node-line bg-node text-accent-text">
                <Icon name={step.icon} />
              </span>
              <span className="font-code text-[11px] tracking-[0.12em] text-muted">{step.number}</span>
            </div>
            <h3 className="mt-9 font-heading text-[24px] font-semibold">{step.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.7] text-muted min-[1024px]:text-[15px]">{step.description}</p>
            <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  );
}
