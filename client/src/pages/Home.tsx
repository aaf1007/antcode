import { Hero } from "@/components/home/Hero";
import { PracticeCards } from "@/components/home/PracticeCards";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 min-[640px]:px-10 min-[1244px]:px-5">
      <main className="min-[1024px]:[--home-space:clamp(20px,2.5svh,28px)]">
        <Hero />
        <PracticeCards />
      </main>
      <footer className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 pb-8 text-muted">
        <span className="font-heading text-[19px] font-bold text-ink">AntCode<span className="text-accent">.</span></span>
      </footer>
    </div>
  );
}
