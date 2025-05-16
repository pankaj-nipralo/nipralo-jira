"use client";

import React, { useState, useEffect } from 'react';
import { timeEntries as initialTimeEntries } from '@/components/home/project-Tracking/timeTrackingData';
import ProjectTimeTracker from '@/components/home/project-Tracking/ProjectTimeTracker';
import TimeTrackingFilters from '@/components/home/project-Tracking/TimeTrackingFiltering';

const ProjectTimeTrackerPage = () => {
  // State for time entries
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [filteredEntries, setFilteredEntries] = useState(initialTimeEntries);

  // State for filters
  const [filters, setFilters] = useState({
    dateRange: { type: 'all' },
    teamMembers: [],
    projects: [],
    statuses: []
  });

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...timeEntries];

    // Apply date range filter
    if (filters.dateRange.type !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Get start of week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

      // Get start of last week
      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      const startOfLastWeekStr = startOfLastWeek.toISOString().split('T')[0];

      // Get end of last week
      const endOfLastWeek = new Date(startOfWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
      const endOfLastWeekStr = endOfLastWeek.toISOString().split('T')[0];

      // Get start of month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

      switch (filters.dateRange.type) {
        case 'today':
          result = result.filter(entry => entry.date === todayStr);
          break;
        case 'thisWeek':
          result = result.filter(entry => entry.date >= startOfWeekStr);
          break;
        case 'lastWeek':
          result = result.filter(
            entry => entry.date >= startOfLastWeekStr && entry.date <= endOfLastWeekStr
          );
          break;
        case 'thisMonth':
          result = result.filter(entry => entry.date >= startOfMonthStr);
          break;
        case 'custom':
          if (filters.dateRange.startDate && filters.dateRange.endDate) {
            result = result.filter(
              entry => entry.date >= filters.dateRange.startDate && entry.date <= filters.dateRange.endDate
            );
          }
          break;
      }
    }

    // Apply team member filter
    if (filters.teamMembers.length > 0) {
      result = result.filter(entry => filters.teamMembers.includes(entry.teamMemberId));
    }

    // Apply project filter
    if (filters.projects.length > 0) {
      const projectIds = filters.projects;
      result = result.filter(entry => {
        const entryProjectId = entry.projectId || entry.epicId;
        return projectIds.includes(entryProjectId);
      });
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      result = result.filter(entry => filters.statuses.includes(entry.status));
    }

    setFilteredEntries(result);
  }, [timeEntries, filters]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Project Time Tracker</h1>
        
        {/* Filters */}
        <TimeTrackingFilters onFilterChange={setFilters} />
      </div>

      {/* Project Time Tracker */}
      <ProjectTimeTracker timeEntries={filteredEntries} />
    </div>
  );
};

export default ProjectTimeTrackerPage;
