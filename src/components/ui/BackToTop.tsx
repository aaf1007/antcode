"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 280);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-4 bottom-4 z-40 inline-flex size-11 items-center justify-center border border-line bg-surface text-ink shadow-lg transition-colors hover:bg-ink/5 sm:right-6 sm:bottom-6"
    >
      <Icon name="arrow-up" />
    </button>
  );
}