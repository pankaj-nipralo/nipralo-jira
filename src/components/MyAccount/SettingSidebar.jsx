"use client";

import {
  Globe,
  ListTodo,
  BarChart3,
  Goal,
  LayoutList,
  Clock,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; 
import { SITE_URL } from "@/lib/constant";

const sidebarItems = [
  { label: "Profile", icon: Globe, href: "my-account" },
  { label: "Security", icon: Globe, href: "my-account/security" },
  { label: "Logout", icon: Goal, href: "login" },
];

const url = `${SITE_URL}`;

// Mock projects
const projects = [
  { name: "warpp", key: "W" },
  { name: "rocket", key: "R" },
  { name: "zeno", key: "Z" },
];

const ProjectSidebar = () => {
  const pathname = usePathname();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <aside className="w-16 md:w-64 border-r bg-white h-full p-3 flex flex-col relative transition-all duration-300">
      {/* Project Header */}
      <div className="relative mb-4">
        {/* <Link href={`${url}`} className="text-gray-800 text-[18px] px-2 font-semibold">Workspace</Link> */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black text-white text-xs font-bold flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left text-black">
              <span className="text-sm font-medium">
                My Settings
              </span>
              <span className="text-xs text-muted-foreground">Project</span>
            </div>
          </div>
        </button>


      </div>

      {/* Sidebar Items */}
      <div className="flex-1 space-y-1">
        {sidebarItems.map(({ label, icon: Icon, href }) => {
          const active =
            href === "/"
              ? pathname === "/nipralo-jira/workspace"
              : pathname.includes(`/nipralo-jira/workspace/${href}`);
          return (
            <div key={label} className="relative group">
              <Link
                href={`${url}/${href}`}
                className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition text-gray-800",
                  active
                    ? "bg-blue-100 text-blue-600"
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
