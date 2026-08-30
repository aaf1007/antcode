import { Hero } from "@/components/home/Hero";
import { ProblemList } from "@/features/problems/components/ProblemList";

export default function Home() {
  return (
    <main>
      <Hero />
      <section aria-labelledby="problems-heading" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
            Practice library
          </p>
          <h2 id="problems-heading" className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-h)] sm:text-3xl">
            Pick a problem. Build the pattern.
          </h2>
          <p className="mt-3 leading-7 text-[color:var(--text)]">
            Start with a problem that matches the skills you want to strengthen today.
          </p>
        </div>
        <ProblemList />
      </section>
    </main>
  );
}
