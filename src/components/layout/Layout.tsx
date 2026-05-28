import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { SidebarContext } from "./SidebarContext";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandSection, setExpandSection] = useState<string | null>(null);

  return (
    <SidebarContext.Provider
      value={{
        expandSection,
        setExpandSection,
        openMobileSidebar: () => setSidebarOpen(true),
      }}
    >
      <div className="min-h-screen bg-white dark:bg-black">
        <ReadingProgress />
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

        <div className="flex pt-14">
          {/* Sidebar overlay (mobile) */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={[
              "fixed top-14 bottom-0 left-0 z-30 w-64 overflow-y-auto",
              "border-r border-zinc-200 dark:border-zinc-800",
              "bg-white dark:bg-black",
              "transition-transform duration-200 lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>

          {/* Main content */}
          <main className="w-full lg:pl-64">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
