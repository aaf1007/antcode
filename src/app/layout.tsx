import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { themeScript } from "@/components/theme/theme";
import "./globals.css";
import Providers from "./providers";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AntCode",
  description: "Learn to code and practice for coding interviews",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={josefinSans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
