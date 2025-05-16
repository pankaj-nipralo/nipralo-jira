"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  CalendarRange,
  ChevronDown,
  Users,
  CheckCircle,
  Filter,
  X,
  FolderGit2
} from "lucide-react";
import { teamMembers, epics, statusOptions } from './timeTrackingData';

const TimeTrackingFilters = ({ onFilterChange }) => {
  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Filter states
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedEpics, setSelectedEpics] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    // Calculate actual date range based on selection
    let dateFilter = { type: dateRange };

    if (dateRange === 'custom' && startDate && endDate) {
      dateFilter = {
        type: 'custom',
        startDate,
        endDate
      };
    }

    // Send filters to parent component
    onFilterChange({
      dateRange: dateFilter,
      teamMembers: selectedTeamMembers,
      epics: selectedEpics,
      statuses: selectedStatuses
    });
  }, [dateRange, startDate, endDate, selectedTeamMembers, selectedEpics, selectedStatuses]);

  // Handle date range change
  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setShowCustomDateRange(value === 'custom');
  };

  // Handle team member selection
  const handleTeamMemberSelect = (memberId) => {
    setSelectedTeamMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Handle epic selection
  const handleEpicSelect = (epicId) => {
    setSelectedEpics(prev => {
      if (prev.includes(epicId)) {
        return prev.filter(id => id !== epicId);
      } else {
        return [...prev, epicId];
      }
    });
  };

  // Handle status selection
  const handleStatusSelect = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange('all');
    setStartDate('');
    setEndDate('');
    setSelectedTeamMembers([]);
    setSelectedEpics([]);
    setSelectedStatuses([]);
    setShowCustomDateRange(false);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (dateRange !== 'all') count++;
    if (selectedTeamMembers.length > 0) count++;
    if (selectedEpics.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    return count;
  };

  return (
    <div className="bg-white p-4 rounded-md border mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Time Tracking Filters</h2>

        {getActiveFilterCount() > 0 && (
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" /> Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarRange className="h-4 w-4 mr-2" />
                {dateRangeOptions.find(option => option.value === dateRange)?.label}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {dateRangeOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={dateRange === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {showCustomDateRange && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Team Member Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Team Members
                {selectedTeamMembers.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedTeamMembers.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {teamMembers.map(member => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => handleTeamMemberSelect(member.id)}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    {member.name}
                  </div>
                  {selectedTeamMembers.includes(member.id) && (
                    <CheckCircle className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Epic Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <FolderGit2 className="h-4 w-4 mr-2" />
                Epics
                {selectedEpics.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedEpics.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {epics.map(epic => (
                <DropdownMenuItem
                  key={epic.id}
                  onClick={() => handleEpicSelect(epic.id)}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    {epic.name}
                  </div>
                  {selectedEpics.includes(epic.id) && (
                    <CheckCircle className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="h-4 w-4 mr-2" />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedStatuses.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {statusOptions.map(status => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => handleStatusSelect(status.value)}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    {status.label}
                  </div>
                  {selectedStatuses.includes(status.value) && (
                    <CheckCircle className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingFilters;
