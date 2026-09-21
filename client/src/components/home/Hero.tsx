import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { PrimaryLink } from "@/components/ui/PrimaryLink";
import { LearningRoadmap } from "./LearningRoadmap";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden pt-16 pb-14 text-center min-[640px]:pt-22 min-[640px]:pb-18 min-[1024px]:pt-24 min-[1024px]:pb-22">
      <div className="pointer-events-none absolute top-[-120px] left-1/2 -z-20 h-[720px] w-[1100px] max-w-[140vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_68%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[640px] w-[1100px] max-w-[140vw] -translate-x-1/2 opacity-30 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" aria-hidden="true" />

      <Link to="/#method" className="group inline-flex items-center gap-2.5 rounded-full border border-node-line bg-surface/80 px-3.5 py-2 font-code text-[9px] tracking-[0.08em] text-accent-text shadow-[0_8px_30px_-20px_rgba(27,31,59,0.4),inset_0_1px_0_var(--color-highlight)] backdrop-blur min-[400px]:text-[10px]">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        A CLEARER WAY TO PREPARE
        <Icon name="arrow" width="13" height="13" className="transition-transform group-hover:translate-x-0.5" />
      </Link>

      <h1 id="hero-heading" className="mx-auto mt-7 max-w-[1020px] font-heading text-[clamp(49px,11.5vw,96px)] leading-[0.98] font-bold tracking-[-0.055em]">
        Master coding interviews.<span className="block text-accent-text">Without the guesswork.</span>
      </h1>
      <p className="mx-auto mt-7 max-w-[700px] text-pretty text-[16px] leading-[1.75] text-muted min-[640px]:text-[19px]">
        AntCode turns scattered practice into a focused system—learn the patterns, understand how they connect, and know exactly what to practice next.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 min-[400px]:flex-row min-[640px]:mt-10">
        <PrimaryLink to="/problem" className="min-[400px]:min-w-[205px]">Start practicing free<Icon name="arrow" /></PrimaryLink>
        <Link to="/#roadmap" className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-[10px] border border-line bg-surface/70 px-6 font-heading text-[16px] font-semibold text-ink shadow-[inset_0_1px_0_var(--color-highlight)] backdrop-blur transition-[background,border-color,transform] hover:-translate-y-0.5 hover:border-node-line hover:bg-surface">
          See the product<Icon name="arrow-down" width="17" height="17" />
        </Link>
      </div>

      <div className="mt-12 text-left min-[640px]:mt-16 min-[1024px]:mt-20">
        <LearningRoadmap />
      </div>
    </section>
  );
}
