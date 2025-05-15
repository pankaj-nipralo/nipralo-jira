"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter, ArrowUpDown, Star, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddProjectModal from "@/components/home/workspace/AddProjectModal";

// Sample project data
const initialProjects = [
  {
    id: "1",
    title: "Ruby Print",
    description: "Team-managed software",
    workItems: { open: 3 },
    slug: "ruby-print",
    lead: "Pankaj Gupta",
    category: "Software",
    lastUpdated: "2023-06-15T10:30:00Z",
    starred: true
  },
  {
    id: "2",
    title: "Warpp",
    description: "Team-managed software",
    workItems: { open: 0 },
    slug: "warpp",
    lead: "Uzair Sayyed",
    category: "Software",
    lastUpdated: "2023-06-10T14:45:00Z",
    starred: false
  },
  {
    id: "3",
    title: "Marketing Campaign",
    description: "Team-managed business",
    workItems: { open: 7 },
    slug: "marketing-campaign",
    lead: "Shoaib Ansari",
    category: "Marketing",
    lastUpdated: "2023-06-14T09:15:00Z",
    starred: false
  },
  {
    id: "4",
    title: "Website Redesign",
    description: "Team-managed software",
    workItems: { open: 12 },
    slug: "website-redesign",
    lead: "Shahbaz Ansari",
    category: "Design",
    lastUpdated: "2023-06-12T16:30:00Z",
    starred: true
  },
  {
    id: "5",
    title: "Mobile App",
    description: "Team-managed software",
    workItems: { open: 5 },
    slug: "mobile-app",
    lead: "Pankaj Gupta",
    category: "Software",
    lastUpdated: "2023-06-13T11:20:00Z",
    starred: false
  },
  {
    id: "6",
    title: "Customer Portal",
    description: "Team-managed software",
    workItems: { open: 9 },
    slug: "customer-portal",
    lead: "Mohammed Zorif",
    category: "Software",
    lastUpdated: "2023-06-11T13:45:00Z",
    starred: false
  }
];

const AllProjects = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize projects
  useEffect(() => {
    // In a real app, this would be an API call
    setProjects(initialProjects);
    setFilteredProjects(initialProjects);
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.lead.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(project => project.category === filterCategory);
    }

    // Apply starred filter
    if (showStarredOnly) {
      result = result.filter(project => project.starred);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle date comparison
      if (sortBy === 'lastUpdated') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Handle number comparison for workItems.open
      if (sortBy === 'workItems') {
        valueA = a.workItems.open;
        valueB = b.workItems.open;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, searchQuery, sortBy, sortOrder, filterCategory, showStarredOnly]);

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Toggle star status
  const toggleStar = (id) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, starred: !project.starred } : project
    ));
  };

  // Handle adding a new project
  const handleAddProject = (newProject) => {
    const projectWithDetails = {
      ...newProject,
      id: `project-${Date.now()}`,
      workItems: { open: 0 },
      lead: "You",
      category: "Software",
      lastUpdated: new Date().toISOString(),
      starred: false
    };

    setProjects([...projects, projectWithDetails]);
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(projects.map(project => project.category))];

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {filterCategory === 'all' ? 'All Categories' : filterCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map(category => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={filterCategory === category ? "bg-gray-100" : ""}
                >
                  {category === 'all' ? 'All Categories' : category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showStarredOnly ? "default" : "outline"}
            onClick={() => setShowStarredOnly(!showStarredOnly)}
            className="flex items-center gap-2"
          >
            <Star className={`h-4 w-4 ${showStarredOnly ? "fill-current" : ""}`} />
            Starred
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {/* Star column */}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('lead')}
                >
                  <div className="flex items-center gap-2">
                    Lead
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('workItems')}
                >
                  <div className="flex items-center gap-2">
                    Open Tasks
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('lastUpdated')}
                >
                  <div className="flex items-center gap-2">
                    Last Updated
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/nipralo-jira/workspace/${project.slug}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleStar(project.id)}>
                        <Star className={`h-5 w-5 text-yellow-400 ${project.starred ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{project.lead}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {project.workItems.open}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/nipralo-jira/workspace/${project.slug}`)}>
                            Open project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/nipralo-jira/workspace/${project.slug}/board`)}>
                            View board
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/nipralo-jira/workspace/${project.slug}/backlog`)}>
                            View backlog
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    No projects found. Try adjusting your filters or create a new project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default AllProjects;
