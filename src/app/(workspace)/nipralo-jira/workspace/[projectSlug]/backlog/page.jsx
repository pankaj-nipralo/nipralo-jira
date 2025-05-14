"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BacklogItem from '@/components/backlog/BacklogItem';
import AddBacklogItemModal from '@/components/backlog/AddBacklogItemModal';
import EditBacklogItemModal from '@/components/backlog/EditBacklogItemModal';

const BacklogPage = () => {
  const params = useParams();
  const { projectSlug } = params;

  // State for sprints and backlog items
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSprints, setExpandedSprints] = useState({});

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetSprint, setTargetSprint] = useState(null);

  // Fetch sprints and backlog items (using dummy data)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyData = generateDummyData();
      setSprints(dummyData.sprints);
      setBacklogItems(dummyData.backlogItems);

      // Initialize expanded state for all sprints
      const initialExpandedState = {};
      dummyData.sprints.forEach(sprint => {
        initialExpandedState[sprint.id] = true; // Start expanded
      });
      setExpandedSprints({...initialExpandedState, backlog: true});

      setLoading(false);
    }, 500);
  }, [projectSlug]);

  // Toggle sprint expansion
  const toggleSprint = (sprintId) => {
    setExpandedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  // Handle adding a new backlog item
  const handleAddItem = (newItem) => {
    if (targetSprint) {
      // Add to specific sprint
      const updatedSprints = sprints.map(sprint => {
        if (sprint.id === targetSprint) {
          return {
            ...sprint,
            items: [...sprint.items, { ...newItem, id: Date.now() }]
          };
        }
        return sprint;
      });
      setSprints(updatedSprints);
    } else {
      // Add to backlog
      setBacklogItems([...backlogItems, { ...newItem, id: Date.now() }]);
    }
    setTargetSprint(null);
  };

  // Handle updating a backlog item
  const handleUpdateItem = (updatedItem) => {
    // Check if item is in a sprint
    let itemFound = false;

    // Check in sprints first
    const updatedSprints = sprints.map(sprint => {
      const itemIndex = sprint.items.findIndex(item => item.id === updatedItem.id);
      if (itemIndex >= 0) {
        itemFound = true;
        const updatedItems = [...sprint.items];
        updatedItems[itemIndex] = updatedItem;
        return { ...sprint, items: updatedItems };
      }
      return sprint;
    });

    if (itemFound) {
      setSprints(updatedSprints);
    } else {
      // Check in backlog
      const updatedBacklog = backlogItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setBacklogItems(updatedBacklog);
    }
  };

  // Handle deleting a backlog item
  const handleDeleteItem = (itemId) => {
    // Check if item is in a sprint
    let itemFound = false;

    // Check in sprints first
    const updatedSprints = sprints.map(sprint => {
      const itemIndex = sprint.items.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        itemFound = true;
        const updatedItems = sprint.items.filter(item => item.id !== itemId);
        return { ...sprint, items: updatedItems };
      }
      return sprint;
    });

    if (itemFound) {
      setSprints(updatedSprints);
    } else {
      // Remove from backlog
      const updatedBacklog = backlogItems.filter(item => item.id !== itemId);
      setBacklogItems(updatedBacklog);
    }
  };

  // Handle moving an item between sprints or backlog
  const handleMoveItem = (itemId, sourceType, sourceId, targetType, targetId) => {
    let itemToMove = null;

    // Remove item from source
    if (sourceType === 'sprint') {
      const updatedSprints = sprints.map(sprint => {
        if (sprint.id === sourceId) {
          const itemIndex = sprint.items.findIndex(item => item.id === itemId);
          if (itemIndex >= 0) {
            itemToMove = sprint.items[itemIndex];
            return {
              ...sprint,
              items: sprint.items.filter(item => item.id !== itemId)
            };
          }
        }
        return sprint;
      });
      setSprints(updatedSprints);
    } else if (sourceType === 'backlog') {
      const itemIndex = backlogItems.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        itemToMove = backlogItems[itemIndex];
        setBacklogItems(backlogItems.filter(item => item.id !== itemId));
      }
    }

    // Add item to target
    if (itemToMove) {
      if (targetType === 'sprint') {
        const updatedSprints = sprints.map(sprint => {
          if (sprint.id === targetId) {
            return {
              ...sprint,
              items: [...sprint.items, itemToMove]
            };
          }
          return sprint;
        });
        setSprints(updatedSprints);
      } else if (targetType === 'backlog') {
        setBacklogItems([...backlogItems, itemToMove]);
      }
    }
  };

  // Generate dummy data for the backlog
  const generateDummyData = () => {
    return {
      sprints: [
        {
          id: 'sprint-1',
          name: 'CRM Sprint 1',
          dateRange: '6 May - 20 May',
          status: 'ACTIVE',
          points: { current: 8, total: 13 },
          items: [
            {
              id: 'crm-12',
              key: 'CRM-12',
              title: 'sdfds',
              status: 'TO DO',
              assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
              estimate: '0m'
            },
            {
              id: 'crm-4',
              key: 'CRM-4',
              title: 'Sample: Log Customer Interactions',
              status: 'IN PROGRESS',
              assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
              estimate: '0m',
              labels: ['SAMPLE', 'CUSTOMER LOG']
            },
            {
              id: 'crm-5',
              key: 'CRM-5',
              title: 'Sample: Generate Interaction Reports',
              status: 'TO DO',
              assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
              estimate: '0m',
              labels: ['SAMPLE', 'CUSTOMER LOG']
            }
          ]
        }
      ],
      backlogItems: [
        {
          id: 'crm-8',
          key: 'CRM-8',
          title: 'Create the login page',
          status: 'TO DO',
          assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
          estimate: '0m'
        },
        {
          id: 'crm-6',
          key: 'CRM-6',
          title: 'Sample: User Role Assignment',
          status: 'IN PROGRESS',
          assignee: { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
          estimate: '0m',
          labels: ['SAMPLE', 'USER MANAGEMENT']
        },
        {
          id: 'crm-7',
          key: 'CRM-7',
          title: 'Test',
          status: 'TO DO',
          assignee: { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
          estimate: '1h 30m'
        },
        {
          id: 'crm-9',
          key: 'CRM-9',
          title: 'Create the home page',
          status: 'TO DO',
          assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
          estimate: '0m'
        },
        {
          id: 'crm-10',
          key: 'CRM-10',
          title: 'Create the about us page',
          status: 'TO DO',
          assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
          estimate: '0m'
        },
        {
          id: 'crm-11',
          key: 'CRM-11',
          title: 'Banner issue',
          status: 'IN PROGRESS',
          assignee: { id: 'user-3', name: 'Robert Brown', avatar: 'RB' },
          estimate: '5h'
        }
      ]
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Backlog</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mx-1">/</span>
              <span>{projectSlug}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-10 h-8 w-[200px]"
              />
            </div>

            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                RB
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                JS
              </div>
              <Button variant="outline" size="sm" className="h-8">
                Version
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Epic
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View settings</DropdownMenuItem>
                  <DropdownMenuItem>Insights</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Sprints Section */}
        {sprints.map(sprint => (
          <div key={sprint.id} className="mb-4 border rounded-md bg-white">
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSprint(sprint.id)}
            >
              {expandedSprints[sprint.id] ? (
                <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
              )}

              <div className="flex-1">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="font-medium">{sprint.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{sprint.dateRange}</span>
                  <span className="text-xs text-gray-500 ml-2">({sprint.items.length} work items)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {sprint.points.current}/{sprint.points.total}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {sprint.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetSprint(sprint.id);
                    setIsAddModalOpen(true);
                  }}
                >
                  Complete sprint
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit sprint</DropdownMenuItem>
                    <DropdownMenuItem>Delete sprint</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {expandedSprints[sprint.id] && (
              <div className="border-t">
                {sprint.items.map(item => (
                  <BacklogItem
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setSelectedItem(item);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={() => handleDeleteItem(item.id)}
                    containerType="sprint"
                    containerId={sprint.id}
                    onMoveItem={handleMoveItem}
                  />
                ))}
                <div className="px-4 py-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                    onClick={() => {
                      setTargetSprint(sprint.id);
                      setIsAddModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Create
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Backlog Section */}
        <div className="border rounded-md bg-white mb-4">
          <div
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedSprints(prev => ({...prev, backlog: !prev.backlog}))}
          >
            {expandedSprints.backlog !== false ? (
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
            )}

            <div className="flex-1">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="font-medium">Backlog</span>
                <span className="text-xs text-gray-500 ml-2">({backlogItems.length} work items)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetSprint(null);
                  setIsAddModalOpen(true);
                }}
              >
                Create sprint
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Move all to sprint</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {expandedSprints.backlog !== false && (
            <div className="border-t">
              {backlogItems.map(item => (
                <BacklogItem
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteItem(item.id)}
                  containerType="backlog"
                  containerId="backlog"
                  onMoveItem={handleMoveItem}
                />
              ))}
              <div className="px-4 py-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => {
                    setTargetSprint(null);
                    setIsAddModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Create
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddBacklogItemModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setTargetSprint(null);
          }}
          onAdd={handleAddItem}
          projectSlug={projectSlug}
          sprintId={targetSprint}
        />

        <EditBacklogItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={selectedItem}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      </div>
    </DndProvider>
  );
};

export default BacklogPage;
