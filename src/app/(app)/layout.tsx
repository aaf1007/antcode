import { AppNavbar } from "@/components/layout/AppNavbar";
import { BackToTop } from "@/components/ui/BackToTop";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppNavbar />
      {children}
      <BackToTop />
    </>
  );
}
