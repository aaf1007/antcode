"use client";

import { useLayoutEffect } from "react";
import { initializeTheme } from "./theme";

export function ThemeSync() {
  useLayoutEffect(() => {
    // Also restore the attribute after React's development-only remount.
    initializeTheme();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncStorage = (event: StorageEvent) => {
      if (event.key === "antcode-theme" || event.key === null) initializeTheme();
    };

    media.addEventListener("change", initializeTheme);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", initializeTheme);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  return null;
}
