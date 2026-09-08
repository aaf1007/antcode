"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";

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
    <header className="top-0 z-50 sticky bg-surface/90 backdrop-blur border-line border-b">
      <div className="flex items-center gap-4 mx-auto px-4 sm:px-6 max-w-6xl h-14">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Brand />

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
                    "flex min-h-11 items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors [font-family:var(--font-display)]",
                    isActive
                      ? "text-ink underline decoration-ink decoration-2 underline-offset-4"
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
        <div className="ml-auto"><ThemeToggle /></div>
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
