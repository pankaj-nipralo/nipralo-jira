"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  CalendarRange,
  ChevronDown,
  CheckCircle,
  Filter,
  X,
  FolderGit2
} from "lucide-react";
import { projects } from '@/components/home/project-Tracking/timeTrackingData';

const TimeTrackingFiltering = ({ onFilterChange }) => {
  // State for filters
  const [dateRange, setDateRange] = useState({ type: 'all' });
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Update parent component with filter changes
  useEffect(() => {
    // Send filters to parent component
    onFilterChange({
      dateRange: dateRange,
      teamMembers: selectedTeamMembers,
      projects: selectedProjects,
      statuses: selectedStatuses
    });
  }, [dateRange, selectedTeamMembers, selectedProjects, selectedStatuses, onFilterChange]);

  // Handle project selection
  const handleProjectSelect = (projectId) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange({ type: 'all' });
    setSelectedTeamMembers([]);
    setSelectedProjects([]);
    setSelectedStatuses([]);
  };

  // Get count of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (dateRange.type !== 'all') count++;
    if (selectedTeamMembers.length > 0) count++;
    if (selectedProjects.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    return count;
  };

  return (
    <div className="bg-white p-4 rounded-md border mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {getActiveFilterCount()}
            </span>
          )}
        </h2>
        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start cursor-pointer">
              <CalendarRange className="h-4 w-4 mr-2" />
              {dateRange.type === 'all' ? 'All Dates' : 'Date Range'}
              {dateRange.type !== 'all' && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  1
                </span>
              )}
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => setDateRange({ type: 'all' })}>
              <div className="flex items-center flex-1">All Dates</div>
              {dateRange.type === 'all' && <CheckCircle className="h-4 w-4 text-primary ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateRange({ type: 'today' })}>
              <div className="flex items-center flex-1">Today</div>
              {dateRange.type === 'today' && <CheckCircle className="h-4 w-4 text-primary ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateRange({ type: 'thisWeek' })}>
              <div className="flex items-center flex-1">This Week</div>
              {dateRange.type === 'thisWeek' && <CheckCircle className="h-4 w-4 text-primary ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateRange({ type: 'thisMonth' })}>
              <div className="flex items-center flex-1">This Month</div>
              {dateRange.type === 'thisMonth' && <CheckCircle className="h-4 w-4 text-primary ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  );
};

export default TimeTrackingFiltering;
