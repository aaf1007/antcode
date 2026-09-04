import Link from "next/link";

export function Navbar() {
  return (
    <header className="top-0 z-50 sticky px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="flex justify-between items-center gap-6 bg-surface/80 shadow-nav backdrop-blur mx-auto px-4 sm:px-5 py-2.5 border border-line rounded-2xl max-w-5xl">
        <Link
          className="flex items-center gap-2.5 focus-visible:rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface font-semibold text-ink text-lg tracking-tight transition-colors"
          href="/"
        >
          <span>
            Ant<span className="text-accent-text">Code</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          <Link
            className="flex items-center gap-2 hover:bg-ink/5 px-3 py-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface font-medium text-ink/70 hover:text-ink text-sm transition-colors"
            href="/problem"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="m9 8-4 4 4 4" />
              <path d="m15 8 4 4-4 4" />
            </svg>
            Problems
          </Link>
        </nav>
      </div>
    </header>
  );
}
