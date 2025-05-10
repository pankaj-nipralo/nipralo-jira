"use client";

import {
  Globe,
  ListTodo,
  CalendarDays,
  BarChart3,
  ClipboardList,
  Goal,
  LayoutList,
  Clock,
  Plus,
  ChevronDown,
  Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

const sidebarItems = [
  { label: "Home", icon: Globe, href: "workspace" },
  { label: "Summary", icon: Globe, href: "summary" },
  { label: "Team", icon: ListTodo, href: "team" },
  { label: "Reports", icon: LayoutList, href: "reports" },
  { label: "client", icon: Clock, href: "client" },
];

const url = "http://localhost:3000/nipralo-jira";

// Mock Workspace
const Workspace = [
  { name: "Home", key: "H", href: "workspace" },
  { name: "rocket", key: "R", href: "workspace/rocket" },
  { name: "zeno", key: "Z", href: "workspace/zeno" },
];

const WorkspaceSidebar = () => {
  const pathname = usePathname();
  const [selectedProject, setSelectedProject] = useState(Workspace[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleWorkspaceelect = (project) => {
    setSelectedProject(project);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="w-64 border-r bg-white h-full p-3 flex flex-col relative">
      {/* Project Header */}
      <div className="relative mb-4">
        {/* <Link href={`${url}`} className="text-gray-800 text-[18px] px-2 font-semibold">Workspace</Link> */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black text-white text-xs font-bold flex items-center justify-center">
              {selectedProject.key}
            </div>
            <div className="flex flex-col text-left text-black">
              <span className="text-sm font-medium">
                {selectedProject.name}
              </span>
              <span className="text-xs text-muted-foreground">Project</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-black" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute mt-1 left-60 top-0 w-full bg-white text-black border rounded-md shadow z-50"
          >
            {Workspace.map((project) => (
              <Link
                href={`${url}/${project.href}`}
                key={project.name}
                onClick={() => handleWorkspaceelect(project)}
                className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-100 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 text-xs font-bold text-gray-700 rounded flex items-center justify-center">
                    {project.key}
                  </div>
                  <span>{project.name}</span>
                </div>
                {selectedProject.name === project.name && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </Link>
            ))}
            <button className="w-full px-3 py-2 text-left text-sm text-gray-900 font-semibold hover:bg-gray-50 border-t">
              + Add Project
            </button>
          </div>
        )}
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

export default WorkspaceSidebar;
