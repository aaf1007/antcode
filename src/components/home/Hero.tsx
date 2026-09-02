export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-[color:var(--border)] border-b"
    >
      <div className="mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-24 max-w-5xl">
        <p className="mb-4 font-semibold text-[color:var(--accent)] text-sm uppercase tracking-[0.18em]">
          Practice with purpose
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl font-semibold text-[color:var(--text-h)] text-4xl sm:text-5xl lg:text-6xl tracking-tight"
        >
          Build confidence for your next coding interview.
        </h1>
        <p className="mt-5 max-w-2xl text-[color:var(--text)] text-base sm:text-lg leading-7">
          Explore focused algorithm problems, understand the patterns that matter,
          and make steady progress one challenge at a time.
        </p>
      </div>
    </section>
  );
}
