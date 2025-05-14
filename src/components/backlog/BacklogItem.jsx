"use client";

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ItemTypes = {
  BACKLOG_ITEM: 'backlogItem'
};

const BacklogItem = ({ 
  item, 
  onEdit, 
  onDelete, 
  containerType, 
  containerId, 
  onMoveItem 
}) => {
  const ref = useRef(null);
  
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BACKLOG_ITEM,
    item: { 
      id: item.id,
      sourceType: containerType,
      sourceId: containerId
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BACKLOG_ITEM,
    drop: (draggedItem) => {
      // Don't drop on itself
      if (draggedItem.id === item.id) return;
      
      // Handle the move
      onMoveItem(
        draggedItem.id,
        draggedItem.sourceType,
        draggedItem.sourceId,
        containerType,
        containerId
      );
    },
    canDrop: (draggedItem) => {
      // Can't drop on itself
      return draggedItem.id !== item.id;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  // Initialize drag and drop refs
  drag(drop(ref));
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'TO DO':
        return 'text-gray-600';
      case 'IN PROGRESS':
        return 'text-blue-600';
      case 'DONE':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get status background color for the dropdown
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'TO DO':
        return 'bg-gray-100';
      case 'IN PROGRESS':
        return 'bg-blue-100';
      case 'DONE':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div 
      ref={ref}
      className={`
        px-4 py-2 border-b flex items-center hover:bg-gray-50 cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${isOver && canDrop ? 'bg-blue-50' : ''}
      `}
    >
      <input type="checkbox" className="mr-3" />
      
      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">{item.key}</span>
          <span className="font-medium">{item.title}</span>
        </div>
        
        {item.labels && item.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.labels.map((label, index) => (
              <span 
                key={index} 
                className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded ${getStatusBgColor(item.status)} ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
        
        {item.estimate && item.estimate !== '0m' && (
          <span className="text-xs text-gray-500">
            {item.estimate}
          </span>
        )}
        
        {item.assignee && (
          <div 
            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium"
            title={item.assignee.name}
          >
            {item.assignee.avatar}
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              Move to top
            </DropdownMenuItem>
            <DropdownMenuItem>
              Move to bottom
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                  onDelete(item.id);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BacklogItem;
