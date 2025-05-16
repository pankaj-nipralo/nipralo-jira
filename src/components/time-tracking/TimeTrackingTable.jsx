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

  // Sort entries
  const sortedEntries = [...timeEntries].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle date comparison
    if (sortField === 'date') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
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
                  <TableCell>{entry.timeSpent} hrs</TableCell>
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
