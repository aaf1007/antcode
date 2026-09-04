type GradientBackgroundProps = {
  /** Extra classes, e.g. to change the gradient or stacking in a specific layout. */
  className?: string;
};

/**
 * Decorative full-bleed backdrop: a soft radial wash of the brand accent that
 * falls off into the canvas colour.
 *
 * `fixed` (not `absolute`) so it always covers the viewport and stays put while
 * the page scrolls; `-z-10` keeps it behind every sibling in `<body>`.
 */
export function GradientBackground({ className }: GradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 -z-10 h-full w-full bg-canvas [background:radial-gradient(125%_125%_at_50%_-50%,#cfdaed_40%,transparent_100%)] pointer-events-none ${className ?? ""}`}
    />
  );
}
