"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WorkspaceSidebar from "@/components/common/Sidebar";
import ProjectSidebar from "@/components/common/ProjectSidebar";
import { usePathname } from "next/navigation";

export default function WorkspaceLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectPage, setIsProjectPage] = useState(false);
  const pathname = usePathname();

  const [shouldShowSidebar, setShouldShowSidebar] = useState(true);

  useEffect(() => {
    // Check if we're in a project page or any of its subpages
    // This regex matches both /nipralo-jira/workspace/[projectSlug] and /nipralo-jira/workspace/[projectSlug]/anything
    const projectPageMatch = pathname.match(
      /\/nipralo-jira\/workspace\/([^\/]+)(\/.*)?$/
    );
    setIsProjectPage(!!projectPageMatch);

    // Only show sidebar on main navigation routes
    const mainRoutes = [
      "/nipralo-jira/workspace",
      "/nipralo-jira/summary",
      "/nipralo-jira/all-projects",
      "/nipralo-jira/reports",
      "/nipralo-jira/time-tracking",
      "/nipralo-jira/client",
    ];

    // Check if current path is one of the main routes or a project page (including subpages)
    const isMainRoute =
      mainRoutes.some((route) => pathname === route) ||
      !!projectPageMatch;

    setShouldShowSidebar(isMainRoute);
  }, [pathname]);

  return (
    <div className="flex h-full">
      {/* Sidebar - only shown on main routes */}
      {shouldShowSidebar && (
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 w-16 md:w-64 h-full bg-gray-800 text-white transition-all duration-500 ease-in-out z-20`}
        >
          {isProjectPage ? <ProjectSidebar /> : <WorkspaceSidebar />}
        </div>
      )}

      {/* Main content wrapper */}
      <div
        className={`${
          shouldShowSidebar && isSidebarOpen ? "ml-16 md:ml-64" : "ml-0"
        } flex-1 transition-all duration-500 ease-in-out`}
      >
        {/* Toggle button - only shown when sidebar is visible */}
        {shouldShowSidebar && (
          <div className="px-3 py-2">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Pass sidebar state to children */}
        <div className="h-full">
          {typeof children === "function"
            ? children({ isSidebarOpen })
            : children}
        </div>
      </div>
    </div>
  );
}
