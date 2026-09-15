// Keep this function self-contained: it also runs in <head> before first paint.
export function initializeTheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  try {
    const saved = window.localStorage.getItem("antcode-theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {
    // Private browsing can block storage; the system preference still works.
  }

  document.documentElement.dataset.theme = theme;
}

export const themeScript = `(${initializeTheme.toString()})();`;
