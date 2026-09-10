import { BackToTop } from "@/components/ui/BackToTop";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
}
