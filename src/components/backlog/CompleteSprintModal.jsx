"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock, Calendar, CheckSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { differenceInDays } from 'date-fns';

const CompleteSprintModal = ({ isOpen, onClose, sprint, onCompleteSprint }) => {
  const [incompleteItemsDestination, setIncompleteItemsDestination] = useState('backlog');
  const [sprintMetrics, setSprintMetrics] = useState({
    totalDuration: 0,
    completedTasks: 0,
    totalTasks: 0,
    completionPercentage: 0,
    isOverdue: false,
    daysOverdue: 0
  });
  
  useEffect(() => {
    if (sprint) {
      // Calculate sprint metrics
      const startDate = new Date(sprint.startDate);
      const endDate = new Date(sprint.endDate);
      const today = new Date();
      
      // Calculate duration in days
      const duration = differenceInDays(endDate, startDate) + 1; // +1 to include both start and end days
      
      // Calculate completion metrics
      const completedTasks = sprint.items.filter(item => item.status === 'DONE').length;
      const totalTasks = sprint.items.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Check if sprint is overdue
      const isOverdue = today > endDate;
      const daysOverdue = isOverdue ? differenceInDays(today, endDate) : 0;
      
      setSprintMetrics({
        totalDuration: duration,
        completedTasks,
        totalTasks,
        completionPercentage,
        isOverdue,
        daysOverdue
      });
    }
  }, [sprint]);
  
  const handleComplete = () => {
    if (!sprint) return;
    
    // Create completion data
    const completionData = {
      completedDate: new Date().toISOString(),
      metrics: {
        ...sprintMetrics,
        incompleteItemsDestination
      }
    };
    
    onCompleteSprint(sprint.id, completionData, incompleteItemsDestination);
    onClose();
  };
  
  if (!isOpen || !sprint) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Sprint</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="mb-4">
          You are about to complete sprint <strong>{sprint.name}</strong>.
        </p>
        
        {/* Sprint Summary */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-blue-500" /> Sprint Summary
          </h3>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 space-y-3">
            {/* Duration */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>Duration:</span>
              </div>
              <span className="font-medium">{sprintMetrics.totalDuration} days</span>
            </div>
            
            {/* Completion Status */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span>Status:</span>
              </div>
              {sprintMetrics.isOverdue ? (
                <span className="text-red-600 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Overdue by {sprintMetrics.daysOverdue} days
                </span>
              ) : (
                <span className="text-green-600 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  On time
                </span>
              )}
            </div>
            
            {/* Task Completion */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <CheckSquare className="h-4 w-4 mr-2 text-blue-500" />
                <span>Completed:</span>
              </div>
              <span className="font-medium">
                {sprintMetrics.completedTasks} of {sprintMetrics.totalTasks} tasks ({sprintMetrics.completionPercentage}%)
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${sprintMetrics.completionPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(sprintMetrics.completionPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Incomplete Items Handling */}
        {sprintMetrics.completedTasks < sprintMetrics.totalTasks && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">
              What to do with incomplete items?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="move-to-backlog"
                  name="incomplete-items"
                  value="backlog"
                  checked={incompleteItemsDestination === 'backlog'}
                  onChange={() => setIncompleteItemsDestination('backlog')}
                  className="mr-2"
                />
                <label htmlFor="move-to-backlog" className="text-sm">
                  Move to Backlog
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="move-to-next-sprint"
                  name="incomplete-items"
                  value="next"
                  checked={incompleteItemsDestination === 'next'}
                  onChange={() => setIncompleteItemsDestination('next')}
                  className="mr-2"
                />
                <label htmlFor="move-to-next-sprint" className="text-sm">
                  Move to Next Sprint (if available)
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleComplete}>
            Complete Sprint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteSprintModal;
