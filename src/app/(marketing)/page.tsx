import { Hero } from "@/components/home/Hero";
import { PracticeCards } from "@/components/home/PracticeCards";

export default function Home() {
  // Reserve 90px for the desktop navbar: 66px tall with a 24px top margin.
  return (
    <div className="mx-auto max-w-[1080px] px-6 min-[640px]:px-10 min-[1244px]:px-5">
      <main className="min-[1024px]:grid min-[1024px]:min-h-[calc(100svh-90px)] min-[1024px]:grid-rows-[1fr_auto] min-[1024px]:[--home-space:clamp(8px,calc((100svh_-_600px)/10),32px)]">
        <Hero />
        <PracticeCards />
      </main>
      <footer className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 pb-8 text-muted">
        <span className="font-heading text-[19px] font-bold text-ink">AntCode<span className="text-accent">.</span></span>
      </footer>
    </div>
  );
}
