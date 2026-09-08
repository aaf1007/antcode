import { Icon } from "@/components/ui/Icon";
import { PrimaryLink } from "@/components/ui/PrimaryLink";
import { LearningRoadmap } from "./LearningRoadmap";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="grid gap-16 pt-16 pb-14 min-[640px]:pt-20 min-[1024px]:grid-cols-[1fr_1.08fr] min-[1024px]:items-center min-[1024px]:gap-13 min-[1024px]:py-[var(--home-space)] min-[1244px]:gap-16">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-[9px] rounded-[100px] border border-line px-[11px] py-[7px] font-code text-[10px] tracking-[0.015em] text-muted min-[400px]:text-[11px]">
          <span aria-hidden="true" className="size-[5px] shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]" />
          Practice By Doing
        </p>
        <h1 id="hero-heading" className="mt-7.5 font-heading text-[clamp(68px,19vw,118px)] leading-[1.08] font-bold tracking-[0.005em] min-[640px]:text-[118px] min-[1024px]:mt-[var(--home-space)] min-[1024px]:text-[clamp(64px,10svh,124px)]">
          <span className="mb-[9px] block text-[clamp(30px,8vw,48px)] leading-[1.2] tracking-normal min-[1024px]:mb-[clamp(6px,1svh,12px)] min-[1024px]:text-[clamp(28px,4svh,47px)]">A better way to</span>
          Prepare<span className="text-accent">.</span>
        </h1>
        <p className="mt-6.5 max-w-[445px] text-[16px] leading-[1.8] text-muted min-[640px]:text-[17px] min-[1024px]:mt-[var(--home-space)] min-[1024px]:text-[clamp(14px,2svh,17px)] min-[1024px]:leading-[1.6]">
          Build confidence for your next coding interview.
          Learn the patterns, connect the dots, and make progress
          one problem at a time.
        </p>
        <div className="mt-8.5 flex flex-col items-start gap-3.5 min-[640px]:flex-row min-[640px]:items-center min-[640px]:gap-5 min-[1024px]:mt-[var(--home-space)] min-[1024px]:flex-col min-[1024px]:items-start min-[1024px]:gap-[15px] min-[1244px]:flex-row min-[1244px]:items-center min-[1244px]:gap-5">
          <PrimaryLink href="/problem">Start practicing<Icon name="arrow" /></PrimaryLink>
        </div>
      </div>
      <LearningRoadmap />
    </section>
  );
}
