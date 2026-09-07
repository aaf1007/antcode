"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/problem",
    label: "Problems",
    icon: ProblemsIcon,
  },
] as const;

/** Full-width app shell navbar used on non-marketing pages. */
export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="shrink-0 font-semibold text-ink text-lg tracking-tight outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ant<span className="text-accent-text">Code</span>
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "border border-line bg-canvas text-ink"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                  ].join(" ")}
                >
                  <Icon />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function ProblemsIcon() {
  return (
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
  );
}
