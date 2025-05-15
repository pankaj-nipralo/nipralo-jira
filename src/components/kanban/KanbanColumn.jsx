"use client";

import React from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const KanbanColumn = ({ status, tasks, onMoveTask, onEditTask, onEditColumn, onDeleteColumn }) => {
  // Set up drop functionality
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      onMoveTask(item.id, status.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex flex-col h-full rounded-lg border ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
    >
      {/* Column Header */}
      <div className={`p-3 ${status.color} rounded-t-lg border-b flex justify-between items-center`}>
        <div className="flex items-center">
          <h3 className="font-medium">{status.name}</h3>
          <span className="ml-2 bg-white text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditColumn(status)}>
              Edit column
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete the "${status.name}" column?`)) {
                  onDeleteColumn(status.id);
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-250px)]">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            No tasks in this column
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTask(task)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
