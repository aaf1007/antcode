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
        </div>
      </section>
    </main>
  );
}
