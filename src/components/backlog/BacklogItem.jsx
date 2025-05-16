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
  onMoveItem,
  isFiltered = false, // New prop to indicate if this item matches current filters
  filterType = null // Type of filter applied (user, epic, search)
}) => {
  const ref = useRef(null);

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BACKLOG_ITEM,
    item: {
      id: item.id,
      sourceType: containerType,
      sourceId: containerId,
      index: item.index // Add index for reordering
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BACKLOG_ITEM,
    hover: (draggedItem) => {
      // Don't replace items with themselves
      if (draggedItem.id === item.id) {
        return;
      }

      // Time to actually perform the action
      if (draggedItem.sourceType === containerType &&
          draggedItem.sourceId === containerId) {
        // This is reordering within the same container
        if (draggedItem.index !== item.index) {
          // Call the reorder function
          onMoveItem(
            draggedItem.id,
            draggedItem.sourceType,
            draggedItem.sourceId,
            containerType,
            containerId,
            item.index // Target index for reordering
          );

          // Update the draggedItem's index to prevent multiple moves
          draggedItem.index = item.index;
        }
      } else {
        // This is moving between containers
        onMoveItem(
          draggedItem.id,
          draggedItem.sourceType,
          draggedItem.sourceId,
          containerType,
          containerId
        );

        // Update the draggedItem's source to prevent multiple moves
        draggedItem.sourceType = containerType;
        draggedItem.sourceId = containerId;
      }
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

  // Get highlight color based on filter type
  const getFilterHighlight = () => {
    if (!isFiltered) return '';

    switch (filterType) {
      case 'user':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'epic':
        return 'bg-purple-50 border-l-4 border-purple-400';
      case 'unassigned':
        return 'bg-gray-50 border-l-4 border-gray-400';
      case 'search':
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div
      ref={ref}
      className={`
        px-4 py-2 border-b flex items-center hover:bg-gray-50 cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${isOver && canDrop ? 'bg-blue-50' : ''}
        ${getFilterHighlight()}
      `}
    >
      <input type="checkbox" className="mr-3" />

      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">{item.key}</span>
          <span className="font-medium">{item.title}</span>

          {/* Epic badge */}
          {item.epic && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded ml-2 text-white ${
                isFiltered && filterType === 'epic' ? 'ring-1 ring-offset-1 ring-purple-500' : ''
              }`}
              style={{ backgroundColor: item.epic.color }}
              title={item.epic.summary}
            >
              {item.epic.name}
            </span>
          )}
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
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${
              isFiltered && filterType === 'user' ? 'ring-2 ring-blue-400' : ''
            }`}
            style={{
              backgroundColor: item.assignee.id === 'user-1'
                ? '#3b82f6'
                : item.assignee.id === 'user-2'
                  ? '#f97316'
                  : '#10b981'
            }}
            title={item.assignee.name}
          >
            {item.assignee.avatar}
          </div>
        )}

        {/* Show unassigned indicator if filtered by unassigned */}
        {!item.assignee && isFiltered && filterType === 'unassigned' && (
          <div
            className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium ring-2 ring-gray-400"
            title="Unassigned"
          >
            ?
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
            <DropdownMenuSeparator />
            {/* Change Epic option */}
            <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('change-epic', { detail: item }))}>
              Change Epic
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
