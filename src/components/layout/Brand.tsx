import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg font-heading text-[22px] leading-none font-bold" aria-label="AntCode home">
      <span>AntCode<span className="text-accent-text">.</span></span>
    </Link>
  );
}
