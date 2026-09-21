import { Link, Outlet, Route, Routes } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { BackToTop } from "@/components/ui/BackToTop";
import Home from "@/pages/Home";
import RoadmapPage from "@/pages/RoadmapPage";
import ProblemsPage from "@/pages/ProblemsPage";
import ProblemPage from "@/pages/ProblemPage";
import { RouteScroll } from "./RouteScroll";

function MarketingLayout() {
  return <><Navbar /><Outlet /></>;
}

function ProblemLayout() {
  return <><AppNavbar /><Outlet /><BackToTop /></>;
}

export function App() {
  return (
    <>
      <RouteScroll />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="*" element={
            <main className="mx-auto max-w-5xl px-4 py-16">
              <h1 className="font-heading text-3xl">Page not found</h1>
              <Link to="/" className="mt-4 inline-block text-accent-text hover:underline">Back to home</Link>
            </main>
          } />
        </Route>
        <Route element={<ProblemLayout />}>
          <Route path="problem" element={<ProblemsPage />} />
          <Route path="problem/:problemId" element={<ProblemPage />} />
        </Route>
      </Routes>
    </>
  );
}
