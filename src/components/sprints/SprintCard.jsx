"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BacklogItem from "@/components/backlog/BacklogItem";

const SprintCard = ({
  sprint,
  onEdit,
  onComplete,
  onMoveItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!sprint.endDate) return null;
    
    const endDate = new Date(sprint.endDate);
    const today = new Date();
    
    // Set time to midnight for accurate day calculation
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <div className="border rounded-md bg-white mb-4">
      <div
        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
        )}

        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-medium">{sprint.name}</span>
            <span className="text-sm text-gray-500 ml-2">
              {sprint.dateRange}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({sprint.items.length} work items)
            </span>
            {sprint.goal && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-2">
                Goal: {sprint.goal}
              </span>
            )}
            {daysRemaining !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded ml-2 flex items-center ${
                  isOverdue
                    ? "bg-red-100 text-red-800"
                    : daysRemaining <= 2
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {isOverdue
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : daysRemaining === 0
                  ? "Due today"
                  : daysRemaining === 1
                  ? "1 day remaining"
                  : `${daysRemaining} days remaining`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {sprint.points.current}/{sprint.points.total}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            {sprint.status}
          </span>
          {sprint.status === "ACTIVE" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(sprint);
              }}
            >
              Complete sprint
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(sprint);
                }}
              >
                Edit sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t">
          {sprint.items.length > 0 ? (
            // Render items if sprint has items
            sprint.items.map((item, index) => (
              <BacklogItem
                key={item.id}
                item={{ ...item, index }}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item.id)}
                containerType="sprint"
                containerId={sprint.id}
                onMoveItem={onMoveItem}
              />
            ))
          ) : (
            // Render empty message if sprint has no items
            <div className="p-4 text-center text-gray-500">
              No items in this sprint
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SprintCard;
