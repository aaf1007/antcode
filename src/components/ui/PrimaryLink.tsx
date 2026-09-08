import Link from "next/link";
import type { ComponentProps } from "react";

type PrimaryLinkProps = ComponentProps<typeof Link> & {
  compact?: boolean;
};

export function PrimaryLink({ compact = false, className = "", ...props }: PrimaryLinkProps) {
  return (
    <Link
      {...props}
      className={[
        "min-h-14 items-center justify-center gap-4 rounded-[10px] border border-[#ffffff12] bg-accent px-6 font-heading text-[18px] font-semibold text-primary shadow-[0_4px_12px_#00000008,inset_0_1px_0_#ffffff15] transition-[background,transform,box-shadow] duration-180 ease-[ease] [&:hover]:bg-[color-mix(in_srgb,var(--color-accent)_85%,white)] [&:hover]:shadow-[0_6px_18px_#00000014] [&:hover:not(:active)]:[transform:translateY(-1px)] active:[transform:translateY(0)]",
        compact ? "hidden min-[640px]:inline-flex min-[640px]:min-h-10 min-[640px]:px-4 min-[640px]:text-[15px]" : "inline-flex",
        className,
      ].join(" ")}
    />
  );
}
