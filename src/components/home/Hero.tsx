export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-[color:var(--border)] bg-[linear-gradient(135deg,#fff_0%,#fcf8ff_52%,#f7efff_100%)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
          Practice with purpose
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text-h)] sm:text-5xl lg:text-6xl"
        >
          Build confidence for your next coding interview.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text)] sm:text-lg">
          Explore focused algorithm problems, understand the patterns that matter,
          and make steady progress one challenge at a time.
        </p>
      </div>
    </section>
  );
}
