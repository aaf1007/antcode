import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { Link, useLocation } from "react-router";

/** Shared navigation for the problem catalog and coding workbench. */
export function AppNavbar() {
  const { pathname } = useLocation();
  const isProblemDetail = pathname.startsWith("/problem/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="flex h-12 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link to="/" aria-label="AntCode home" className="grid size-9 shrink-0 place-items-center rounded-md text-accent-text transition-colors hover:bg-ink/5">
          <Icon name="code" width="23" height="23" strokeWidth="2.2" />
        </Link>
        <span className="h-5 w-px shrink-0 bg-line" aria-hidden="true" />
        <nav aria-label="Primary navigation">
          <Link
            to="/problem"
            aria-current={!isProblemDetail ? "page" : undefined}
            className="inline-flex min-h-9 items-center rounded-md px-2.5 text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Problem List
          </Link>
        </nav>
        <div className="ml-auto flex shrink-0 items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
