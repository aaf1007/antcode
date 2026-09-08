import type { SVGProps } from "react";

const paths = {
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" /></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
  "arrow-up": <><path d="M12 19V5m-6 6 6-6 6 6" /></>,
  external: <path d="M6 18 18 6M6 6h12v12" />,
  map: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v1m0 18v1M2 12h1m18 0h1M4.93 4.93l.71.71m12.72 12.72.71.71m0-14.14-.71.71M5.64 18.36l-.71.71" /></>,
  moon: <path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z" />,
  layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
} as const;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}
