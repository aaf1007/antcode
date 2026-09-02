import Link from "next/link";

export function Navbar() {
  return (
    <header className="backdrop-blur border-[color:var(--border)] border-b">
      <div className="flex justify-between items-center mx-auto px-5 sm:px-8 max-w-5xl min-h-16">
        <Link
          className="focus-visible:rounded-sm outline-none focus-visible:ring-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-offset-4 font-semibold text-[color:var(--text-h)] hover:text-[color:var(--accent)] text-lg tracking-tight transition-colors"
          href="/"
        >
          Ant<span className="text-[color:var(--accent)]">Code</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            className="px-3 py-2 rounded-md outline-none focus-visible:ring-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-offset-2 font-medium text-[color:var(--text)] hover:text-[color:var(--accent)] text-sm transition-colors hover:bg-[color:var(--accent-bg)]"
            href="/"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
