import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-[color:var(--border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          className="text-lg font-semibold tracking-tight text-[color:var(--text-h)] outline-none transition-colors hover:text-[color:var(--accent)] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-4"
          href="/"
        >
          Ant<span className="text-[color:var(--accent)]">Code</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[color:var(--text)] outline-none transition-colors hover:bg-[color:var(--accent-bg)] hover:text-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
            href="/"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
