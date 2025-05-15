"use client";

import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';

const ItemTypes = {
  BACKLOG_ITEM: 'backlogItem'
};

const EmptySprintDropTarget = ({ containerId, onMoveItem }) => {
  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BACKLOG_ITEM,
    drop: (draggedItem) => {
      // Handle the drop - move the item to this sprint
      onMoveItem(
        draggedItem.id,
        draggedItem.sourceType,
        draggedItem.sourceId,
        'sprint',
        containerId
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        px-4 py-6 border-b flex flex-col items-center justify-center
        ${isOver ? 'bg-blue-50' : 'bg-gray-50'}
        transition-colors duration-200 min-h-[100px]
      `}
    >
      <div className="text-center text-gray-500">
        <Plus className="h-5 w-5 mx-auto mb-2" />
        <p className="text-sm">Drag items here</p>
      </div>
    </div>
  );
};

export default EmptySprintDropTarget;
