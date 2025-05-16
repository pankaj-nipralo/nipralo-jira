"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Clock
} from "lucide-react";
import { formatDate } from './timeTrackingData';

// Format time as "X h Y m" format
const formatTime = (time) => {
  // Handle invalid inputs (null, undefined, NaN)
  if (time === null || time === undefined) {
    return '0 h 0 m';
  }

  // Handle time object with hours and minutes properties
  if (typeof time === 'object' && time.hours !== undefined) {
    const h = time.hours || 0;
    const m = time.minutes || 0;
    return `${h} h ${m} m`;
  }

  // Handle numeric input (for backward compatibility and totals)
  if (typeof time === 'number' || !isNaN(Number(time))) {
    // If it's 0, return 0 h 0 m
    if (Number(time) === 0) {
      return '0 h 0 m';
    }

    // Convert decimal hours to hours and minutes
    const numHours = Number(time);
    const h = Math.floor(numHours);
    const m = Math.round((numHours - h) * 60);

    // Handle case where minutes round up to 60
    if (m === 60) {
      return `${h + 1} h 0 m`;
    }

    return `${h} h ${m} m`;
  }

  // Fallback for any other case
  return '0 h 0 m';
};

const TimeTrackingTable = ({
  timeEntries,
  onEdit,
  onDelete,
  onApprove,
  onReject
}) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Helper function to convert timeSpent to minutes for comparison
  const getTimeInMinutes = (timeSpent) => {
    if (typeof timeSpent === 'object' && timeSpent.hours !== undefined) {
      return (timeSpent.hours * 60) + (timeSpent.minutes || 0);
    }
    if (typeof timeSpent === 'number') {
      return timeSpent * 60; // Convert decimal hours to minutes
    }
    return 0;
  };

  // Sort entries
  const sortedEntries = [...timeEntries].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle date comparison
    if (sortField === 'date') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    // Handle timeSpent comparison
    if (sortField === 'timeSpent') {
      valueA = getTimeInMinutes(valueA);
      valueB = getTimeInMinutes(valueB);
    }

    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span>;
      case 'submitted':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Submitted</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField === field) {
      return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date {renderSortIndicator('date')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('teamMemberName')}
              >
                <div className="flex items-center">
                  Team Member {renderSortIndicator('teamMemberName')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('projectName')}
              >
                <div className="flex items-center">
                  Epics {renderSortIndicator('projectName')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('taskDescription')}
              >
                <div className="flex items-center">
                  Task Description {renderSortIndicator('taskDescription')}
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('timeSpent')}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Hours {renderSortIndicator('timeSpent')}
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status {renderSortIndicator('status')}
                </div>
              </TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No task time entries found
                </TableCell>
              </TableRow>
            ) : (
              sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.teamMemberName}</TableCell>
                  <TableCell>{entry.epicName}</TableCell>
                  <TableCell>{entry.taskDescription}</TableCell>
                  <TableCell>{formatTime(entry.timeSpent)}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(entry)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(entry.id)}
                        className="h-8 w-8 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {entry.status === 'submitted' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onApprove(entry.id)}
                            className="h-8 w-8 text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onReject(entry.id)}
                            className="h-8 w-8 text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimeTrackingTable;
