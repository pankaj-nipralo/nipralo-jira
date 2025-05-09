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
import { useState } from "react";

const sidebarItems = [
  { label: "Summary", icon: Globe, href: "summary" },
  { label: "Backlog", icon: LayoutList, href: "backlog" },
  { label: "Board", icon: ListTodo, href: "board" },
  { label: "Time Tracking", icon: ClipboardList, href: "time-tracking" },
  { label: "Goals", icon: Goal, href: "goals" },
  { label: "All work", icon: ListTodo, href: "all-work" },
  { label: "Team", icon: ListTodo, href: "team" },
  { label: "Reports", icon: BarChart3, href: "reports" },
  { label: "client", icon: BarChart3, href: "client" },
];

// Mock projects
const projects = [
  { name: "warpp", key: "W" },
  { name: "rocket", key: "R" },
  { name: "zeno", key: "Z" },
];

const ProjectSidebar = () => {
  const pathname = usePathname();
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setDropdownOpen(false);
  };

  return (
    <aside className="w-64 border-r bg-white h-full p-3 flex flex-col relative">
      {/* Project Header */}
      <div className="relative mb-4">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black text-white text-xs font-bold flex items-center justify-center">
              {selectedProject.key}
            </div>
            <div className="flex flex-col text-left text-black">
              <span className="text-sm font-medium">{selectedProject.name}</span>
              <span className="text-xs text-muted-foreground">Project</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-black" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute mt-1 left-60 top-0 w-full bg-white text-black border rounded-md shadow z-50">
            {projects.map((project) => (
              <button
                key={project.name}
                onClick={() => handleProjectSelect(project)}
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
              </button>
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
          const active = pathname.includes(href);
          return (
            <Link
              key={label}
              href={href}
              className={clsx(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition",
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

      {/* Footer */}
      <div className="mt-auto pt-4 border-t">
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <Plus className="w-4 h-4" />
          Add view
        </button>
        <p className="text-xs text-muted-foreground mt-1">
          You're in a team-managed project
        </p>
      </div>
    </aside>
  );
};

export default ProjectSidebar;
