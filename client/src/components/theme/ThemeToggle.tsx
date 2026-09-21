import { Icon } from "@/components/ui/Icon";
import type { MouseEvent } from "react";

let fallbackAnimationTimer: number | undefined;

export function ThemeToggle() {
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem("antcode-theme", next);
      } catch {
        // The toggle still works for this visit when storage is unavailable.
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme();
      return;
    }

    if (!document.startViewTransition) {
      window.clearTimeout(fallbackAnimationTimer);
      document.documentElement.classList.add("theme-transition");
      applyTheme();
      fallbackAnimationTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 420);
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(applyTheme);
    void transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // A rapid second toggle can supersede the first transition.
      });
  }

  return (
    <button type="button" aria-label="Toggle color theme" onClick={toggleTheme} className="theme-toggle grid size-11 shrink-0 cursor-pointer place-items-center rounded-[10px] text-muted transition-[background,color] duration-150 ease-[ease] [&:hover]:bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] [&:hover]:text-ink">
      <span aria-hidden="true" className="theme-toggle__icon theme-toggle__icon--moon">
        <Icon name="moon" />
      </span>
      <span aria-hidden="true" className="theme-toggle__icon theme-toggle__icon--sun">
        <Icon name="sun" />
      </span>
    </button>
  );
}
