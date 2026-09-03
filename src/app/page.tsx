import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Hero />

      <section aria-labelledby="problems-heading" className="mx-auto px-5 sm:px-8 py-12 sm:py-16 max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="font-semibold text-sm uppercase tracking-[0.18em] text-accent-text">
            Practice library
          </p>
          <h2 id="problems-heading" className="mt-3 font-semibold text-ink text-2xl sm:text-3xl tracking-tight">
            Pick a problem. Build the pattern.
          </h2>
          <p className="mt-3 text-ink/70 leading-7">
            Start with a problem that matches the skills you want to strengthen today.
          </p>
        </div>
      </section>
    </main>
  );
}
