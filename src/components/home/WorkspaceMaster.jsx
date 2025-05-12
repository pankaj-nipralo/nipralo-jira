"use client";
import React from "react";

import WorkspaceCard from "./workspace/WorkspcaeCard";
import WorkedOnList from "./workspace/WorkspaceUpdatesPanel";

const projects = [
  {
    title: "Nipralo",
    description: "Team-managed software",
    workItems: { open: 3 },
    slug: "nipralo",
  },
  {
    title: "ABS",
    description: "Team-managed software",
    workItems: { open: 0 },
    slug: "abc",
  },
];

const recentActivity = [
  {
    tab: "Worked on",
    title: "Yesterday",
    tasks: [
      {
        id: "1",
        title: "Fix login issue",
        code: "CRM-105",
        project: "Customer Relationship Management System",
        status: "Created",
        userInitials: "HS",
      },
      {
        id: "2",
        title: "Add new analytics page",
        code: "CRM-106",
        project: "Customer Relationship Management System",
        status: "Updated",
        userInitials: "MJ",
      },
    ],
  },
  {
    tab: "Worked on",
    title: "Last Week",
    tasks: [
      {
        id: "3",
        title: "Refactor sidebar layout",
        code: "CRM-99",
        project: "Ruby Print",
        status: "Updated",
        userInitials: "RK",
      },
    ],
  },
  {
    tab: "Viewed",
    title: "Last 3 Days",
    tasks: [
      {
        id: "4",
        title: "Check mobile responsiveness",
        code: "WEB-88",
        project: "Landing Page Redesign",
        status: "Viewed",
        userInitials: "HS",
      },
    ],
  },
  {
    tab: "Assigned to me",
    title: "This Week",
    tasks: [
      {
        id: "5",
        title: "Design bug report modal",
        code: "BUG-77",
        project: "Bug Tracker",
        status: "Assigned",
        userInitials: "HS",
      },
      {
        id: "6",
        title: "Research session replay tools",
        code: "UX-20",
        project: "Analytics Dashboard",
        status: "Pending",
        userInitials: "HS",
      },
    ],
  },
  {
    tab: "Starred",
    title: "Favorites",
    tasks: [
      {
        id: "7",
        title: "Improve form validation",
        code: "FORM-32",
        project: "Account System",
        status: "Starred",
        userInitials: "HS",
      },
    ],
  },
];

const WorkspaceMaster = () => {
  return (
    <div className="p-4 max-w-screen-xl mx-auto ">
      <h2 className="text-2xl font-semibold mb-6">Your work</h2>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Recent projects</h3>
        <a href="#" className="text-blue-600 text-sm hover:underline">
          Add Project
        </a>
      </div>

      <div className="flex flex-wrap gap-4">
        {projects.map((project, index) => (
          <WorkspaceCard key={index} {...project} />
        ))}
      </div>

      <WorkedOnList items={recentActivity} />
    </div>
  );
};

export default WorkspaceMaster;
