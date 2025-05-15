"use client";
import React, { useState, useEffect } from "react";
import WorkspaceCard from "./workspace/WorkspcaeCard";
import WorkspaceUpdatesPanel from "./workspace/WorkspaceUpdatesPanel";
import AddProjectModal from "./workspace/AddProjectModal";

const initialProjects = [
  {
    title: "Ruby Print",
    description: "Team-managed software",
    workItems: { open: 3 },
    slug: "ruby-print",
  },
  {
    title: "Warpp",
    description: "Team-managed software",
    workItems: { open: 0 },
    slug: "warpp",
  },
  {
    title: "Ruby Print",
    description: "Team-managed software",
    workItems: { open: 3 },
    slug: "ruby-print",
  },
  {
    title: "Warpp",
    description: "Team-managed software",
    workItems: { open: 0 },
    slug: "warpp",
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
  const [projects, setProjects] = useState(initialProjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sliceProjects, setSliceProjects] = useState([]);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleSliceProjects = (projects) => {
    setSliceProjects(projects.slice(0, 3));
  };

  useEffect(() => {
    handleSliceProjects(projects);
  }, [projects]);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Workspace</h2>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Projects</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gray-800 cursor-pointer text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Add Project
            </button>
            <a 
              href="/nipralo-jira/all-projects" 
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg transition-colors"
            >
              View All Projects
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliceProjects.map((project) => (
            <WorkspaceCard key={project.slug} {...project} />
          ))}
        </div>
      </div>

      <AddProjectModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProject={handleAddProject}
      />

      <WorkspaceUpdatesPanel items={recentActivity} />
    </div>
  );
};

export default WorkspaceMaster;