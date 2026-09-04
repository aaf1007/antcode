import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { GradientBackground } from "@/components/ui/gradient-background-4";
import "./globals.css";

export const metadata: Metadata = {
  title: "AntCode",
  description: "Learn to code and practice for coding interviews",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GradientBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
