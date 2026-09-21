import { Icon } from "@/components/ui/Icon";
import { PrimaryLink } from "@/components/ui/PrimaryLink";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="pb-16 min-[640px]:pb-22">
      <div className="relative isolate overflow-hidden rounded-[26px] border border-primary bg-primary px-6 py-12 text-center text-white shadow-[0_24px_70px_-42px_rgba(27,31,59,0.7)] min-[640px]:px-10 min-[640px]:py-16 dark:border-node-line">
        <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(var(--color-accent)_1px,transparent_1px),linear-gradient(90deg,var(--color-accent)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" aria-hidden="true" />
        <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[70%] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
        <p className="font-code text-[10px] tracking-[0.14em] text-accent">YOUR NEXT PROBLEM IS WAITING</p>
        <h2 id="cta-heading" className="mx-auto mt-4 max-w-[680px] font-heading text-[clamp(38px,7vw,62px)] leading-[1.02] font-bold tracking-[-0.02em]">Make your next practice session count.</h2>
        <p className="mx-auto mt-5 max-w-[540px] text-[15px] leading-[1.7] text-white/65 min-[640px]:text-[16px]">Pick a challenge, name the pattern, and build the kind of confidence that holds up in an interview.</p>
        <div className="mt-8 flex justify-center">
          <PrimaryLink to="/problem" className="border-white/10 shadow-[0_8px_24px_#00000030]">Browse the problem library<Icon name="arrow" /></PrimaryLink>
        </div>
      </div>
    </section>
  );
}
