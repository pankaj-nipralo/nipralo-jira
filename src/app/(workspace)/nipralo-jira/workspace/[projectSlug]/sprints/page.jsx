"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectActiveSprints,
  selectSprintStatus,
  selectSprintError,
  fetchSprints,
  updateSprint,
  completeSprint
} from "@/store/sprintSlice";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SprintCard from "@/components/sprints/SprintCard";
import EditSprintModal from "@/components/backlog/EditSprintModal";
import CompleteSprintModal from "@/components/backlog/CompleteSprintModal";
import EditBacklogItemModal from "@/components/backlog/EditBacklogItemModal";

const SprintsPage = () => {
  const params = useParams();
  const { projectSlug } = params;

  const dispatch = useAppDispatch();
  const activeSprints = useAppSelector(selectActiveSprints);
  const status = useAppSelector(selectSprintStatus);
  const error = useAppSelector(selectSprintError);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSprints, setFilteredSprints] = useState([]);

  // State for modals
  const [isEditSprintModalOpen, setIsEditSprintModalOpen] = useState(false);
  const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch sprints on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSprints(projectSlug));
    }
  }, [status, dispatch, projectSlug]);

  // Filter sprints when search query changes
  useEffect(() => {
    if (activeSprints.length > 0) {
      if (!searchQuery) {
        setFilteredSprints(activeSprints);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = activeSprints.filter(sprint => {
          // Search in sprint name and goal
          if (
            sprint.name.toLowerCase().includes(query) ||
            (sprint.goal && sprint.goal.toLowerCase().includes(query))
          ) {
            return true;
          }

          // Search in sprint items
          return sprint.items.some(item =>
            item.title.toLowerCase().includes(query) ||
            item.key.toLowerCase().includes(query)
          );
        });
        setFilteredSprints(filtered);
      }
    } else {
      setFilteredSprints([]);
    }
  }, [activeSprints, searchQuery]);

  // Handle sprint edit
  const handleEditSprint = (sprint) => {
    setSelectedSprint(sprint);
    setIsEditSprintModalOpen(true);
  };

  // Handle sprint update
  const handleUpdateSprint = (updatedSprint) => {
    dispatch(updateSprint(updatedSprint));
  };

  // Handle sprint completion
  const handleCompleteSprint = (sprint) => {
    setSelectedSprint(sprint);
    setIsCompleteSprintModalOpen(true);
  };

  // Handle sprint completion submit
  const handleCompleteSprintSubmit = (sprintId, completionData, incompleteItemsDestination) => {
    dispatch(completeSprint({ sprintId, completionData, incompleteItemsDestination }));
  };

  // Handle item edit
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditItemModalOpen(true);
  };

  // Handle item update
  const handleUpdateItem = (updatedItem) => {
    // This would be handled by the task slice
    console.log("Update item:", updatedItem);
  };

  // Handle item delete
  const handleDeleteItem = (itemId) => {
    // This would be handled by the task slice
    console.log("Delete item:", itemId);
  };

  // Handle item move
  const handleMoveItem = (itemId, sourceContainerId, targetContainerId) => {
    // This would be handled by the sprint slice
    console.log("Move item:", itemId, sourceContainerId, targetContainerId);
  };

  // Render loading state
  if (status === 'loading') {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Active Sprints</h1>
          </div>
          <div className="text-center py-8">Loading sprints...</div>
        </div>
      </DndProvider>
    );
  }

  // Render error state
  if (status === 'failed') {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Active Sprints</h1>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-6">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to load sprints: {error}</span>
          </div>
        </div>
      </DndProvider>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Active Sprints</h1>
        </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search sprints and issues"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Sprints */}
      {filteredSprints.length > 0 ? (
        filteredSprints.map((sprint) => (
          <SprintCard
            key={sprint.id}
            sprint={sprint}
            onEdit={handleEditSprint}
            onComplete={handleCompleteSprint}
            onMoveItem={handleMoveItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        ))
      ) : (
        <div className="bg-white border rounded-md p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No active sprints</h3>
          <p className="text-gray-500 mb-4">
            There are no active sprints at the moment. Start a sprint from the backlog to see it here.
          </p>
        </div>
      )}

      {/* Modals */}
      <EditSprintModal
        isOpen={isEditSprintModalOpen}
        onClose={() => {
          setIsEditSprintModalOpen(false);
          setSelectedSprint(null);
        }}
        sprint={selectedSprint}
        onUpdateSprint={handleUpdateSprint}
      />

      <CompleteSprintModal
        isOpen={isCompleteSprintModalOpen}
        onClose={() => {
          setIsCompleteSprintModalOpen(false);
          setSelectedSprint(null);
        }}
        sprint={selectedSprint}
        onCompleteSprint={handleCompleteSprintSubmit}
      />

      <EditBacklogItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />
    </div>
    </DndProvider>
  );
};

export default SprintsPage;
