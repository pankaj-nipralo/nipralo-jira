"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { timeEntries as initialTimeEntries } from './timeTrackingData';
import TimeTrackingTable from './TimeTrackingTable';
import TimeEntryModal from './TimeEntryModal';
import TimeTrackingFilters from './TimeTrackingFilters';
import TaskTrackingSummary from './TimeTrackingSummary';

const TimeTrackingMaster = () => {
  // State for time entries
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [filteredEntries, setFilteredEntries] = useState(initialTimeEntries);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    dateRange: { type: 'all' },
    teamMembers: [],
    epics: [],
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

    // Apply epic filter
    if (filters.epics.length > 0) {
      result = result.filter(entry => filters.epics.includes(entry.epicId));
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      result = result.filter(entry => filters.statuses.includes(entry.status));
    }

    setFilteredEntries(result);
  }, [timeEntries, filters]);

  // Handle adding a new time entry
  const handleAddEntry = (entryData) => {
    const newEntry = {
      ...entryData,
      id: timeEntries.length > 0 ? Math.max(...timeEntries.map(e => e.id)) + 1 : 1
    };

    setTimeEntries(prev => [...prev, newEntry]);
  };

  // Handle editing a time entry
  const handleEditEntry = (entryData) => {
    setTimeEntries(prev =>
      prev.map(entry => entry.id === entryData.id ? entryData : entry)
    );
    setEditEntry(null);
  };

  // Handle deleting a time entry
  const handleDeleteEntry = (entryId) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  // Handle approving a time entry
  const handleApproveEntry = (entryId) => {
    setTimeEntries(prev =>
      prev.map(entry => entry.id === entryId ? { ...entry, status: 'approved' } : entry)
    );
  };

  // Handle rejecting a time entry
  const handleRejectEntry = (entryId) => {
    setTimeEntries(prev =>
      prev.map(entry => entry.id === entryId ? { ...entry, status: 'rejected' } : entry)
    );
  };

  // Open edit modal
  const openEditModal = (entry) => {
    setEditEntry(entry);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Time Tracking</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Task Time
        </Button>
      </div>

      {/* Filters */}
      <TimeTrackingFilters onFilterChange={setFilters} />

      {/* Summary */}
      <TaskTrackingSummary timeEntries={filteredEntries} />

      {/* Time Entries Table */}
      <TimeTrackingTable
        timeEntries={filteredEntries}
        onEdit={openEditModal}
        onDelete={handleDeleteEntry}
        onApprove={handleApproveEntry}
        onReject={handleRejectEntry}
      />

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <TimeEntryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddEntry}
        />
      )}

      {editEntry && (
        <TimeEntryModal
          isOpen={!!editEntry}
          onClose={() => setEditEntry(null)}
          onSave={handleEditEntry}
          editEntry={editEntry}
        />
      )}
    </div>
  );
};

export default TimeTrackingMaster;
