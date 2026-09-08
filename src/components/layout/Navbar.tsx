"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { PrimaryLink } from "@/components/ui/PrimaryLink";
import Link from "next/link";
import { useRef, useState } from "react";
import { Brand } from "./Brand";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-4 z-50 mx-5 mt-4 max-w-[1080px] min-[640px]:top-6 min-[640px]:mx-8 min-[640px]:mt-6 min-[1244px]:mx-auto" onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <div className="flex min-h-[58px] items-center justify-between gap-4 rounded-[18px] border border-line bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-3.5 py-2.5 shadow-[var(--shadow-nav),inset_0_1px_0_var(--color-highlight)] backdrop-blur-[18px] min-[640px]:px-5">
        <Brand />
        <div className="flex items-center gap-1.5 min-[768px]:gap-3">
          <ThemeToggle />
          <span className="hidden min-[768px]:block min-[768px]:h-5.5 min-[768px]:w-px min-[768px]:bg-line" aria-hidden="true" />
          <PrimaryLink href="/problem" compact>Start coding<Icon name="arrow" width="16" height="16" /></PrimaryLink>
          <button ref={menuButton} type="button" className="grid size-11 cursor-pointer place-items-center rounded-[10px] text-muted [&:hover]:bg-canvas [&:hover]:text-ink min-[768px]:hidden" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-[calc(100%+8px)] rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-nav)] min-[768px]:hidden" hidden={!menuOpen}>
        <Link href="/problem" className="flex items-center gap-3 rounded-[10px] p-4 font-heading text-[17px] font-semibold [&:hover]:bg-canvas" onClick={() => setMenuOpen(false)}><Icon name="code" />Practice<Icon name="arrow" className="ml-auto" /></Link>
        <Link href="/#roadmap" className="flex items-center gap-3 rounded-[10px] p-4 font-heading text-[17px] font-semibold [&:hover]:bg-canvas" onClick={() => setMenuOpen(false)}><Icon name="map" />Roadmap<Icon name="arrow" className="ml-auto" /></Link>
      </nav>
    </header>
  );
}
