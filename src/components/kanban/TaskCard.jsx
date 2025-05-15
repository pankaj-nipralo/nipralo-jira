"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { CheckSquare, AlertTriangle, Bookmark, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TaskCard = ({ task, onClick }) => {
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Get task type icon
  const getTaskTypeIcon = () => {
    switch (task.type) {
      case 'bug':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'story':
        return <Bookmark className="h-4 w-4 text-purple-500" />;
      default:
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get priority class
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if due date is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      ref={drag}
      className={`
        bg-white rounded-md border shadow-sm p-3 cursor-pointer
        hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Task Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {getTaskTypeIcon()}
          <span className="text-xs font-medium text-gray-500 ml-2">{task.key}</span>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs ${getPriorityClass()}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Task Title */}
      <h3 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h3>
      
      {/* Task Footer */}
      <div className="flex justify-between items-center mt-3">
        {/* Assignee */}
        {task.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
              {task.assignee.avatar}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        )}
        
        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center text-xs ${isOverdue() ? 'text-red-500' : 'text-gray-500'}`}>
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
