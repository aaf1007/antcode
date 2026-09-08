"use client";

import { Icon } from "@/components/ui/Icon";

export function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("antcode-theme", next);
    } catch {
      // The toggle still works for this visit when storage is unavailable.
    }
  }

  return (
    <button type="button" onClick={toggleTheme} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-[10px] text-muted transition-[background,color] duration-150 ease-[ease] [&:hover]:bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] [&:hover]:text-ink">
      <span className="flex dark:hidden">
        <Icon name="moon" />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="hidden dark:flex">
        <Icon name="sun" />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}
