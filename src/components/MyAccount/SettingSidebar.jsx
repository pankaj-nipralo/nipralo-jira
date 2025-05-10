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
import { useState } from "react";

const sidebarItems = [
  { label: "Profile", icon: Globe, href: "my-account" },
  { label: "Security", icon: Globe, href: "my-account/security" },
  { label: "Logout", icon: Goal, href: "login" },
];

const url = "http://localhost:3000";

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
    <aside className="w-64 border-r bg-white h-full p-3 flex flex-col relative">
      {/* Project Header */}
      <div className="relative mb-4">
        {/* <Link href={`${url}`} className="text-gray-800 text-[18px] px-2 font-semibold">Workspace</Link> */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md "
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black text-white text-xs font-bold flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left text-black">
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
            <Link
              key={label}
              href={`${url}/${href}`}
              className={clsx(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition text-gray-800",
                active
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Link>
          );
        })}
      </div>

    </aside>
  );
};

export default ProjectSidebar;
