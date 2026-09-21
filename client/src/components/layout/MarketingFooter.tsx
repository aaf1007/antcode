import { Link } from "react-router";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line pt-8 pb-10 min-[640px]:pt-10">
      <div className="flex flex-col gap-8 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div className="max-w-[340px]">
          <Link to="/" className="font-heading text-[22px] font-bold text-ink">AntCode<span className="text-accent-text">.</span></Link>
          <p className="mt-3 text-[13px] leading-[1.6] text-muted">Focused coding interview practice for people who want to understand the pattern, not memorize the answer.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-muted">
          <Link to="/#method" className="transition-colors hover:text-ink">Method</Link>
          <Link to="/#features" className="transition-colors hover:text-ink">Why AntCode</Link>
          <Link to="/roadmap" className="transition-colors hover:text-ink">Roadmap</Link>
          <Link to="/problem" className="transition-colors hover:text-ink">Practice</Link>
        </nav>
      </div>
      <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-code text-[9px] tracking-[0.08em] text-muted min-[640px]:text-[10px]">
        <span>LEARN THE PATTERN. SOLVE THE PROBLEM.</span>
        <span>© 2026 ANTCODE</span>
      </div>
    </footer>
  );
}
