import { Suspense, useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar, { MobileTabBar } from "../components/SideBar";
import CommandPalette from "../components/ui/CommandPalette";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { PageTransition } from "../components/ui/motion";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-canvas pt-[env(safe-area-inset-top)]">
      <SideBar open={sidebarOpen} onClose={closeSidebar} />
      <MobileTabBar />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} onOpenPalette={openPalette} />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<DashboardSkeleton />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
