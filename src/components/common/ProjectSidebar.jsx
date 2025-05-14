"use client";

import {
  LayoutDashboard,
  ClipboardList,
  KanbanSquare,
  FileStack,
  Timer,
  Flag,
  CheckSquare,
  Users,
  CalendarDays,
  MessageCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import clsx from "clsx";

const ProjectSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Summary", icon: ClipboardList, href: "summary" },
  { label: "Backlog", icon: FileStack, href: "backlog" },
  { label: "Board", icon: KanbanSquare, href: "board" },
  { label: "All Work", icon: ClipboardList, href: "all-work" },
  { label: "Time Tracking", icon: Timer, href: "time-tracking" },
  { label: "Sprints", icon: Flag, href: "sprints" },
  { label: "Tasks", icon: CheckSquare, href: "tasks" },
  { label: "Team", icon: Users, href: "team" },
  { label: "Calendar", icon: CalendarDays, href: "calendar" },
  { label: "Messages", icon: MessageCircle, href: "messages" },
  { label: "Settings", icon: Settings, href: "settings" },
];

const ProjectSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  // Extract projectSlug from params or from the URL if not available in params
  let { projectSlug } = params;

  // If projectSlug is not available in params, extract it from the pathname
  if (!projectSlug) {
    const match = pathname.match(/\/nipralo-jira\/workspace\/([^\/]+)/);
    if (match && match[1]) {
      projectSlug = match[1];
    }
  }
  const baseUrl = "/nipralo-jira/workspace";

  return (
    <aside className="w-16 md:w-64 border-r bg-white h-full p-3 flex flex-col relative transition-all duration-300">
      {/* Back to Projects */}
      {/* <div className="mb-6">
        <Link
          href="/nipralo-jira/workspace"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline text-sm font-medium">Back to Projects</span>
        </Link>
      </div> */}

      {/* Project Header */}
      <div className="relative mb-6">
        <div className="w-full flex items-center px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">
              {projectSlug?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-medium text-gray-800">
                Project {projectSlug}
              </span>
              <span className="text-xs text-muted-foreground">
                Project Dashboard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 space-y-1">
        {ProjectSidebarItems.map(({ label, icon: Icon, href }) => {
          // Determine if this item is active
          const itemPath = href
            ? `${baseUrl}/${projectSlug}/${href}`
            : `${baseUrl}/${projectSlug}`;

          // Check if this item is active - either exact match or if it's a subpage
          const isActive =
            pathname === itemPath ||
            (href === "" && pathname === `${baseUrl}/${projectSlug}`) ||
            (href !== "" &&
              pathname.startsWith(`${baseUrl}/${projectSlug}/${href}/`));

          return (
            <div key={label} className="relative group">
              <Link
                href={
                  href
                    ? `${baseUrl}/${projectSlug}/${href}`
                    : `${baseUrl}/${projectSlug}`
                }
                className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition",
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
              {/* Tooltip for mobile view */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 md:hidden whitespace-nowrap z-50">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ProjectSidebar;
