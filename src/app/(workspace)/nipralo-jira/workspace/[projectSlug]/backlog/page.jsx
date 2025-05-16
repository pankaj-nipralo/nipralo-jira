"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BacklogItem from "@/components/backlog/BacklogItem";
import AddBacklogItemModal from "@/components/backlog/AddBacklogItemModal";
import EditBacklogItemModal from "@/components/backlog/EditBacklogItemModal";
import EmptySprintDropTarget from "@/components/backlog/EmptySprintDropTarget";
import CreateSprintModal from "@/components/backlog/CreateSprintModal";
import EditSprintModal from "@/components/backlog/EditSprintModal";
import CompleteSprintModal from "@/components/backlog/CompleteSprintModal";

const BacklogPage = () => {
  const params = useParams();
  const { projectSlug } = params;

  // State for sprints and backlog items
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSprints, setExpandedSprints] = useState({});

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBacklogItems, setFilteredBacklogItems] = useState([]);
  const [filteredSprints, setFilteredSprints] = useState([]);
  const [epicFilter, setEpicFilter] = useState("all");

  // State for sprint management
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const [isEditSprintModalOpen, setIsEditSprintModalOpen] = useState(false);
  const [isStartSprintModalOpen, setIsStartSprintModalOpen] = useState(false);
  const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  // State for epic management
  const [epics, setEpics] = useState([]);
  const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
  const [isChangeEpicModalOpen, setIsChangeEpicModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // State for item modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetSprint, setTargetSprint] = useState(null);

  // State for user management
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch sprints, backlog items, users, and epics (using dummy data)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyData = generateDummyData();
      setSprints(dummyData.sprints);
      setBacklogItems(dummyData.backlogItems);
      setUsers(dummyData.users);
      setEpics(dummyData.epics);

      // Initialize filtered data
      setFilteredSprints(dummyData.sprints);
      setFilteredBacklogItems(dummyData.backlogItems);

      // Initialize expanded state for all sprints
      const initialExpandedState = {};
      dummyData.sprints.forEach((sprint) => {
        initialExpandedState[sprint.id] = true; // Start expanded
      });
      setExpandedSprints({ ...initialExpandedState, backlog: true });

      setLoading(false);
    }, 100);
  }, [projectSlug]);

  // Handle search, epic, and user filtering
  useEffect(() => {
    // Start with all items
    let tempSprintItems = [...sprints];
    let tempBacklogItems = [...backlogItems];

    // Track which filter is applied to each item
    const filteredItemsMap = new Map();
    let activeFilterType = null;

    // Apply epic filter first if it's not 'all'
    if (epicFilter !== "all") {
      activeFilterType = "epic";

      // Filter sprints - keep sprint structure but filter items within each sprint
      tempSprintItems = tempSprintItems.map((sprint) => {
        const filteredItems = sprint.items.filter(
          (item) => item.epic && item.epic.id === epicFilter
        );

        // Mark these items as filtered by epic
        filteredItems.forEach((item) => {
          filteredItemsMap.set(item.id, "epic");
        });

        return {
          ...sprint,
          items: filteredItems,
        };
      });

      // Filter backlog items
      tempBacklogItems = tempBacklogItems.filter(
        (item) => item.epic && item.epic.id === epicFilter
      );

      // Mark these items as filtered by epic
      tempBacklogItems.forEach((item) => {
        filteredItemsMap.set(item.id, "epic");
      });
    }

    // Apply user filter if any users are selected
    if (selectedUsers.length > 0) {
      activeFilterType = activeFilterType || "user";

      // Check if "unassigned" is in the selected users
      const includeUnassigned = selectedUsers.includes("unassigned");

      // Filter sprints - keep sprint structure but filter items within each sprint
      tempSprintItems = tempSprintItems.map((sprint) => {
        const filteredItems = sprint.items.filter((item) => {
          // Include unassigned items if unassigned filter is selected
          if (includeUnassigned && (!item.assignee || !item.assignee.id)) {
            filteredItemsMap.set(item.id, "unassigned");
            return true;
          }

          // Include items assigned to any of the selected users
          const isAssignedToSelectedUser =
            item.assignee && selectedUsers.includes(item.assignee.id);
          if (isAssignedToSelectedUser) {
            filteredItemsMap.set(item.id, "user");
          }
          return isAssignedToSelectedUser;
        });

        return {
          ...sprint,
          items: filteredItems,
        };
      });

      // Filter backlog items
      tempBacklogItems = tempBacklogItems.filter((item) => {
        // Include unassigned items if unassigned filter is selected
        if (includeUnassigned && (!item.assignee || !item.assignee.id)) {
          filteredItemsMap.set(item.id, "unassigned");
          return true;
        }

        // Include items assigned to any of the selected users
        const isAssignedToSelectedUser =
          item.assignee && selectedUsers.includes(item.assignee.id);
        if (isAssignedToSelectedUser) {
          filteredItemsMap.set(item.id, "user");
        }
        return isAssignedToSelectedUser;
      });
    }

    // Then apply search filter if there's a search query
    if (searchQuery.trim() !== "") {
      activeFilterType = activeFilterType || "search";
      const query = searchQuery.toLowerCase();

      // Filter sprints - keep sprint structure but filter items within each sprint
      tempSprintItems = tempSprintItems.map((sprint) => {
        const filteredItems = sprint.items.filter(
          (item) =>
            item.key.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query) ||
            (item.labels &&
              item.labels.some((label) =>
                label.toLowerCase().includes(query)
              )) ||
            (item.epic && item.epic.name.toLowerCase().includes(query))
        );

        // Mark these items as filtered by search if not already filtered
        filteredItems.forEach((item) => {
          if (!filteredItemsMap.has(item.id)) {
            filteredItemsMap.set(item.id, "search");
          }
        });

        return {
          ...sprint,
          items: filteredItems,
        };
      });

      // Filter backlog items
      tempBacklogItems = tempBacklogItems.filter(
        (item) =>
          item.key.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          (item.labels &&
            item.labels.some((label) => label.toLowerCase().includes(query))) ||
          (item.epic && item.epic.name.toLowerCase().includes(query))
      );

      // Mark these items as filtered by search if not already filtered
      tempBacklogItems.forEach((item) => {
        if (!filteredItemsMap.has(item.id)) {
          filteredItemsMap.set(item.id, "search");
        }
      });
    }

    // Add filter information to each item
    tempSprintItems = tempSprintItems.map((sprint) => {
      const itemsWithFilterInfo = sprint.items.map((item) => ({
        ...item,
        _filterInfo: {
          isFiltered: filteredItemsMap.has(item.id),
          filterType: filteredItemsMap.get(item.id),
        },
      }));

      return {
        ...sprint,
        items: itemsWithFilterInfo,
      };
    });

    tempBacklogItems = tempBacklogItems.map((item) => ({
      ...item,
      _filterInfo: {
        isFiltered: filteredItemsMap.has(item.id),
        filterType: filteredItemsMap.get(item.id),
      },
    }));

    setFilteredSprints(tempSprintItems);
    setFilteredBacklogItems(tempBacklogItems);
  }, [searchQuery, epicFilter, selectedUsers, sprints, backlogItems]);

  // Toggle sprint expansion
  const toggleSprint = (sprintId) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  // Add event listener for change epic
  useEffect(() => {
    const handleChangeEpic = (event) => {
      setSelectedItem(event.detail);
      setIsChangeEpicModalOpen(true);
    };

    window.addEventListener("change-epic", handleChangeEpic);

    return () => {
      window.removeEventListener("change-epic", handleChangeEpic);
    };
  }, []);

  // Find the next sequential key number
  const getNextKeyNumber = () => {
    // Collect all keys from sprints and backlog
    const allKeys = [];

    // Get keys from sprint items
    sprints.forEach((sprint) => {
      sprint.items.forEach((item) => {
        if (item.key && item.key.startsWith("CRM-")) {
          const keyNumber = parseInt(item.key.replace("CRM-", ""), 10);
          if (!isNaN(keyNumber)) {
            allKeys.push(keyNumber);
          }
        }
      });
    });

    // Get keys from backlog items
    backlogItems.forEach((item) => {
      if (item.key && item.key.startsWith("CRM-")) {
        const keyNumber = parseInt(item.key.replace("CRM-", ""), 10);
        if (!isNaN(keyNumber)) {
          allKeys.push(keyNumber);
        }
      }
    });

    // Find the highest key number
    const highestKey = allKeys.length > 0 ? Math.max(...allKeys) : 0;

    // Return the next key number
    return highestKey + 1;
  };

  // Handle adding a new backlog item
  const handleAddItem = (newItem) => {
    // Generate a sequential key if not provided
    const nextKeyNumber = getNextKeyNumber();
    const itemWithKey = {
      ...newItem,
      id: Date.now(),
      key: `CRM-${nextKeyNumber}`,
    };

    if (targetSprint) {
      // Add to specific sprint
      const updatedSprints = sprints.map((sprint) => {
        if (sprint.id === targetSprint) {
          return {
            ...sprint,
            items: [...sprint.items, itemWithKey],
          };
        }
        return sprint;
      });
      setSprints(updatedSprints);
    } else {
      // Add to backlog
      setBacklogItems([...backlogItems, itemWithKey]);
    }
    setTargetSprint(null);
  };

  // Handle updating a backlog item
  const handleUpdateItem = (updatedItem) => {
    // Check if item is in a sprint
    let itemFound = false;

    // Check in sprints first
    const updatedSprints = sprints.map((sprint) => {
      const itemIndex = sprint.items.findIndex(
        (item) => item.id === updatedItem.id
      );
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
      const updatedBacklog = backlogItems.map((item) =>
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
    const updatedSprints = sprints.map((sprint) => {
      const itemIndex = sprint.items.findIndex((item) => item.id === itemId);
      if (itemIndex >= 0) {
        itemFound = true;
        const updatedItems = sprint.items.filter((item) => item.id !== itemId);
        return { ...sprint, items: updatedItems };
      }
      return sprint;
    });

    if (itemFound) {
      setSprints(updatedSprints);
    } else {
      // Remove from backlog
      const updatedBacklog = backlogItems.filter((item) => item.id !== itemId);
      setBacklogItems(updatedBacklog);
    }
  };

  // Handle moving an item between sprints or backlog
  const handleMoveItem = (
    itemId,
    sourceType,
    sourceId,
    targetType,
    targetId,
    targetIndex
  ) => {
    let itemToMove = null;
    let updatedSprints = [...sprints];
    let updatedBacklogItems = [...backlogItems];

    // Find and remove the item from its source
    if (sourceType === "sprint") {
      const sourceSprintIndex = updatedSprints.findIndex(
        (sprint) => sprint.id === sourceId
      );
      if (sourceSprintIndex >= 0) {
        const itemIndex = updatedSprints[sourceSprintIndex].items.findIndex(
          (item) => item.id === itemId
        );
        if (itemIndex >= 0) {
          // Get a deep copy of the item
          itemToMove = JSON.parse(
            JSON.stringify(updatedSprints[sourceSprintIndex].items[itemIndex])
          );
          // Remove the item from source
          updatedSprints[sourceSprintIndex] = {
            ...updatedSprints[sourceSprintIndex],
            items: updatedSprints[sourceSprintIndex].items.filter(
              (item) => item.id !== itemId
            ),
          };
        }
      }
    } else if (sourceType === "backlog") {
      const itemIndex = updatedBacklogItems.findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex >= 0) {
        // Get a deep copy of the item
        itemToMove = JSON.parse(JSON.stringify(updatedBacklogItems[itemIndex]));
        // Remove the item from source
        updatedBacklogItems = updatedBacklogItems.filter(
          (item) => item.id !== itemId
        );
      }
    }

    // Add the item to its target
    if (itemToMove) {
      // Handle reordering within the same container
      if (
        sourceType === targetType &&
        sourceId === targetId &&
        targetIndex !== undefined
      ) {
        if (sourceType === "sprint") {
          const sprintIndex = updatedSprints.findIndex(
            (sprint) => sprint.id === sourceId
          );
          if (sprintIndex >= 0) {
            const items = [...updatedSprints[sprintIndex].items];
            // Insert at the target index
            items.splice(targetIndex, 0, itemToMove);
            updatedSprints[sprintIndex] = {
              ...updatedSprints[sprintIndex],
              items,
            };
          }
        } else if (sourceType === "backlog") {
          // Insert at the target index
          updatedBacklogItems.splice(targetIndex, 0, itemToMove);
        }
      }
      // Handle moving between containers
      else {
        if (targetType === "sprint") {
          const targetSprintIndex = updatedSprints.findIndex(
            (sprint) => sprint.id === targetId
          );
          if (targetSprintIndex >= 0) {
            updatedSprints[targetSprintIndex] = {
              ...updatedSprints[targetSprintIndex],
              items: [...updatedSprints[targetSprintIndex].items, itemToMove],
            };
          }
        } else if (targetType === "backlog") {
          updatedBacklogItems = [...updatedBacklogItems, itemToMove];
        }
      }

      // Update state
      setSprints(updatedSprints);
      setBacklogItems(updatedBacklogItems);
    }
  };

  // Generate dummy data for the backlog
  const generateDummyData = () => {
    // Define epics first
    const epicsList = [
      {
        id: "epic-1",
        key: "EPIC-1",
        name: "User Authentication",
        summary: "Implement user authentication and authorization",
        color: "#0052CC", // Blue
      },
      {
        id: "epic-2",
        key: "EPIC-2",
        name: "Customer Management",
        summary: "Customer data management and interaction tracking",
        color: "#FF5630", // Red
      },
      {
        id: "epic-3",
        key: "EPIC-3",
        name: "Reporting",
        summary: "Reporting and analytics features",
        color: "#00875A", // Green
      },
      {
        id: "epic-4",
        key: "EPIC-4",
        name: "UI Implementation",
        summary: "User interface implementation and design",
        color: "#6554C0", // Purple
      },
    ];

    return {
      sprints: [
        {
          id: "sprint-1",
          name: "CRM Sprint 1",
          goal: "Complete core CRM functionality",
          dateRange: "6 May - 20 May",
          startDate: "2023-05-06",
          endDate: "2023-05-20",
          status: "ACTIVE",
          points: { current: 8, total: 13 },
          items: [
            {
              id: "crm-12",
              key: "CRM-12",
              title: "Setup database schema",
              status: "TO DO",
              assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
              estimate: "0m",
              type: "task",
              priority: "High",
              epic: epicsList[1], // Customer Management
            },
            {
              id: "crm-4",
              key: "CRM-4",
              title: "Sample: Log Customer Interactions",
              status: "IN PROGRESS",
              assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
              estimate: "0m",
              labels: ["SAMPLE", "CUSTOMER LOG"],
              type: "task",
              priority: "Medium",
              epic: epicsList[1], // Customer Management
            },
            {
              id: "crm-5",
              key: "CRM-5",
              title: "Sample: Generate Interaction Reports",
              status: "TO DO",
              assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
              estimate: "0m",
              labels: ["SAMPLE", "CUSTOMER LOG"],
              type: "story",
              priority: "Low",
              epic: epicsList[2], // Reporting
            },
          ],
        },
        {
          id: "sprint-2",
          name: "CRM Sprint 2",
          goal: "Implement user management",
          dateRange: "21 May - 3 June",
          startDate: "2023-05-21",
          endDate: "2023-06-03",
          status: "PLANNED",
          points: { current: 0, total: 21 },
          items: [
            {
              id: "crm-15",
              key: "CRM-15",
              title: "User authentication flow",
              status: "TO DO",
              assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
              estimate: "8h",
              type: "task",
              priority: "High",
              epic: epicsList[0], // User Authentication
            },
            {
              id: "crm-16",
              key: "CRM-16",
              title: "Role-based permissions",
              status: "TO DO",
              assignee: { id: "user-3", name: "Robert Brown", avatar: "RB" },
              estimate: "13h",
              labels: ["SECURITY", "USER MANAGEMENT"],
              type: "task",
              priority: "High",
              epic: epicsList[0], // User Authentication
            },
          ],
        },
      ],
      backlogItems: [
        {
          id: "crm-8",
          key: "CRM-8",
          title: "Create the login page",
          status: "TO DO",
          assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
          estimate: "0m",
          type: "task",
          priority: "Medium",
          epic: epicsList[3], // UI Implementation
        },
        {
          id: "crm-6",
          key: "CRM-6",
          title: "Sample: User Role Assignment",
          status: "IN PROGRESS",
          assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
          estimate: "0m",
          labels: ["SAMPLE", "USER MANAGEMENT"],
          type: "task",
          priority: "Medium",
          epic: epicsList[0], // User Authentication
        },
        {
          id: "crm-7",
          key: "CRM-7",
          title: "Test login functionality",
          status: "TO DO",
          assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
          estimate: "1h 30m",
          type: "bug",
          priority: "High",
          epic: epicsList[0], // User Authentication
        },
        {
          id: "crm-9",
          key: "CRM-9",
          title: "Create the home page",
          status: "TO DO",
          assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
          estimate: "0m",
          type: "task",
          priority: "Low",
          epic: epicsList[3], // UI Implementation
        },
        {
          id: "crm-10",
          key: "CRM-10",
          title: "Create the about us page",
          status: "TO DO",
          assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
          estimate: "0m",
          type: "task",
          priority: "Low",
          epic: epicsList[3], // UI Implementation
        },
        {
          id: "crm-11",
          key: "CRM-11",
          title: "Banner issue",
          status: "IN PROGRESS",
          assignee: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          estimate: "5h",
          type: "bug",
          priority: "Medium",
          epic: epicsList[3], // UI Implementation
        },
      ],
      users: [
        {
          id: "user-1",
          name: "John Doe",
          avatar: "JD",
          email: "john.doe@example.com",
          role: "Developer",
        },
        {
          id: "user-2",
          name: "Jane Smith",
          avatar: "JS",
          email: "jane.smith@example.com",
          role: "Designer",
        },
        {
          id: "user-3",
          name: "Robert Brown",
          avatar: "RB",
          email: "robert.brown@example.com",
          role: "Product Manager",
        },
        {
          id: "user-4",
          name: "Emily Johnson",
          avatar: "EJ",
          email: "emily.johnson@example.com",
          role: "QA Engineer",
        },
        {
          id: "user-5",
          name: "Michael Wilson",
          avatar: "MW",
          email: "michael.wilson@example.com",
          role: "DevOps Engineer",
        },
      ],
      epics: epicsList,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 max-w-[1200px] mx-auto">
        {/* Backlog Header */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1">
              {/* User Filter Label */}
              {selectedUsers.length > 0 && (
                <div className="text-xs text-gray-500 mr-1">Filtering by:</div>
              )}

              {/* User Avatars */}
              {users.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                    selectedUsers.includes(user.id)
                      ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor:
                      user.id === "user-1"
                        ? "#3b82f6"
                        : user.id === "user-2"
                        ? "#f97316"
                        : "#10b981",
                  }}
                  title={`${user.name} (${user.role})`}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id]
                    );
                  }}
                >
                  {user.avatar}
                </div>
              ))}

              {/* Unassigned filter option */}
              <div
                className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                  selectedUsers.includes("unassigned")
                    ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
                    : "hover:opacity-80"
                }`}
                title="Unassigned Tasks"
                onClick={() => {
                  setSelectedUsers((prev) =>
                    prev.includes("unassigned")
                      ? prev.filter((id) => id !== "unassigned")
                      : [...prev, "unassigned"]
                  );
                }}
              >
                <span className="text-gray-500">?</span>
              </div>

              {/* More users dropdown if there are more than 3 */}
              {users.length > 3 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-80">
                      +{users.length - 3}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {users.slice(3).map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => {
                          setSelectedUsers((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-medium ${
                              selectedUsers.includes(user.id)
                                ? "ring-1 ring-blue-500"
                                : ""
                            }`}
                          >
                            {user.avatar}
                          </div>
                          <span>{user.name}</span>
                          {selectedUsers.includes(user.id) && (
                            <span className="ml-auto text-blue-500">✓</span>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedUsers([])}>
                      Clear user filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Clear filters button - only show when users are selected */}
              {selectedUsers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedUsers([])}
                  title="Clear user filters"
                >
                  <X className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}

              {/* Epic Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Epic {epicFilter !== "all" && "✓"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setEpicFilter("all")}
                    className={epicFilter === "all" ? "bg-gray-100" : ""}
                  >
                    All Epics
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {epics.map((epic) => (
                    <DropdownMenuItem
                      key={epic.id}
                      onClick={() => setEpicFilter(epic.id)}
                      className={epicFilter === epic.id ? "bg-gray-100" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: epic.color }}
                        ></div>
                        <span>{epic.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setIsCreateEpicModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Epic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        {filteredSprints.map((sprint) => (
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
                      setSelectedSprint(sprint);
                      setIsCompleteSprintModalOpen(true);
                    }}
                  >
                    Complete sprint
                  </Button>
                )}
                {sprint.status === "PLANNED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSprint(sprint);
                      setIsStartSprintModalOpen(true);
                    }}
                  >
                    Start sprint
                  </Button>
                )}
                {sprint.status === "COMPLETED" && sprint.completionData && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sprint.completionData.metrics.isOverdue
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sprint.completionData.metrics.isOverdue
                      ? `Overdue by ${sprint.completionData.metrics.daysOverdue} days`
                      : 'Completed on time'}
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSprint(sprint);
                        setIsEditSprintModalOpen(true);
                      }}
                    >
                      Edit sprint
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Are you sure you want to delete sprint "${sprint.name}"?`
                          )
                        ) {
                          // Remove the sprint but keep its items in the backlog
                          const updatedSprints = sprints.filter(
                            (s) => s.id !== sprint.id
                          );
                          const sprintItems = sprint.items || [];
                          setSprints(updatedSprints);
                          setBacklogItems([...backlogItems, ...sprintItems]);
                        }
                      }}
                    >
                      Delete sprint
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {expandedSprints[sprint.id] && (
              <div className="border-t">
                {sprint.items.length > 0 ? (
                  // Render items if sprint has items
                  sprint.items.map((item, index) => (
                    <BacklogItem
                      key={item.id}
                      item={{ ...item, index }}
                      onEdit={() => {
                        setSelectedItem(item);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => handleDeleteItem(item.id)}
                      containerType="sprint"
                      containerId={sprint.id}
                      onMoveItem={handleMoveItem}
                      isFiltered={item._filterInfo?.isFiltered}
                      filterType={item._filterInfo?.filterType}
                    />
                  ))
                ) : (
                  // Render empty sprint drop target if sprint has no items
                  <EmptySprintDropTarget
                    containerId={sprint.id}
                    onMoveItem={handleMoveItem}
                  />
                )}
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
            onClick={() =>
              setExpandedSprints((prev) => ({
                ...prev,
                backlog: !prev.backlog,
              }))
            }
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
                <span className="text-xs text-gray-500 ml-2">
                  ({backlogItems.length} work items)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateSprintModalOpen(true);
                }}
              >
                Create sprint
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
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
              {filteredBacklogItems.map((item, index) => (
                <BacklogItem
                  key={item.id}
                  item={{ ...item, index }}
                  onEdit={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteItem(item.id)}
                  containerType="backlog"
                  containerId="backlog"
                  onMoveItem={handleMoveItem}
                  isFiltered={item._filterInfo?.isFiltered}
                  filterType={item._filterInfo?.filterType}
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

        {/* Item Modals */}
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

        {/* Sprint Management Modals */}
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen}
          onClose={() => setIsCreateSprintModalOpen(false)}
          onCreateSprint={(newSprint) => {
            setSprints([...sprints, newSprint]);
          }}
        />

        <EditSprintModal
          isOpen={isEditSprintModalOpen}
          onClose={() => {
            setIsEditSprintModalOpen(false);
            setSelectedSprint(null);
          }}
          sprint={selectedSprint}
          onUpdateSprint={(updatedSprint) => {
            // Update the sprint in the sprints array
            const updatedSprints = sprints.map(sprint =>
              sprint.id === updatedSprint.id ? updatedSprint : sprint
            );
            setSprints(updatedSprints);
          }}
        />

        {isStartSprintModalOpen && selectedSprint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Start Sprint</h2>
              <p className="mb-4">
                You are about to start sprint{" "}
                <strong>{selectedSprint.name}</strong>.
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Sprint Goal:</span>
                  <span className="font-medium">
                    {selectedSprint.goal || "No goal set"}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {selectedSprint.dateRange}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">
                    {selectedSprint.items.length} issues
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsStartSprintModalOpen(false);
                    setSelectedSprint(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Update sprint status to ACTIVE
                    const updatedSprints = sprints.map((sprint) =>
                      sprint.id === selectedSprint.id
                        ? { ...sprint, status: "ACTIVE" }
                        : sprint
                    );
                    setSprints(updatedSprints);
                    setIsStartSprintModalOpen(false);
                    setSelectedSprint(null);
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        )}

        <CompleteSprintModal
          isOpen={isCompleteSprintModalOpen}
          onClose={() => {
            setIsCompleteSprintModalOpen(false);
            setSelectedSprint(null);
          }}
          sprint={selectedSprint}
          onCompleteSprint={(sprintId, completionData, incompleteItemsDestination) => {
            // Handle incomplete items
            let updatedBacklogItems = [...backlogItems];
            let nextSprintId = null;

            // Find the next planned sprint if we're moving items to the next sprint
            if (incompleteItemsDestination === 'next') {
              const plannedSprints = sprints.filter(s => s.status === 'PLANNED');
              if (plannedSprints.length > 0) {
                // Sort by start date to find the earliest planned sprint
                plannedSprints.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                nextSprintId = plannedSprints[0].id;
              }
            }

            // Update sprints with completion data and handle incomplete items
            const updatedSprints = sprints.map(sprint => {
              if (sprint.id === sprintId) {
                // Get completed items
                const completedItems = sprint.items.filter(item => item.status === 'DONE');

                // Create updated sprint with completion data
                return {
                  ...sprint,
                  status: "COMPLETED",
                  completionData,
                  items: completedItems // Keep only completed items in the sprint
                };
              } else if (sprint.id === nextSprintId && incompleteItemsDestination === 'next') {
                // Move incomplete items to the next sprint
                const incompleteItems = selectedSprint.items.filter(item => item.status !== 'DONE');
                return {
                  ...sprint,
                  items: [...sprint.items, ...incompleteItems]
                };
              }
              return sprint;
            });

            // If we're moving items to the backlog or there's no next sprint
            if (incompleteItemsDestination === 'backlog' || (incompleteItemsDestination === 'next' && !nextSprintId)) {
              const incompleteItems = selectedSprint.items.filter(item => item.status !== 'DONE');
              updatedBacklogItems = [...updatedBacklogItems, ...incompleteItems];
            }

            // Update state
            setSprints(updatedSprints);
            setBacklogItems(updatedBacklogItems);
          }}
        />

        {/* Create Epic Modal */}
        {isCreateEpicModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Epic</h2>
                <button
                  onClick={() => setIsCreateEpicModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const name = formData.get("name");
                  const summary = formData.get("summary");
                  const color = formData.get("color");

                  // Create a new epic
                  const newEpic = {
                    id: `epic-${Date.now()}`,
                    key: `EPIC-${epics.length + 1}`,
                    name,
                    summary,
                    color,
                  };

                  setEpics([...epics, newEpic]);
                  setIsCreateEpicModalOpen(false);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Epic Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder="e.g., User Authentication"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Summary
                    </label>
                    <Input
                      name="summary"
                      placeholder="e.g., Implement user authentication features"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="color"
                        defaultValue="#0052CC"
                        className="h-8 w-8 p-0 border-0"
                      />
                      <Input
                        name="colorHex"
                        defaultValue="#0052CC"
                        className="flex-1"
                        onChange={(e) => {
                          const colorInput = e.target.form.elements.color;
                          colorInput.value = e.target.value;
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateEpicModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Epic Modal */}
        {isChangeEpicModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-[#00000049] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Change Epic</h2>
                <button
                  onClick={() => {
                    setIsChangeEpicModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Select an epic for{" "}
                  <strong>
                    {selectedItem.key}: {selectedItem.title}
                  </strong>
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div
                  className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => {
                    // Update the item to remove epic
                    handleUpdateItem({
                      ...selectedItem,
                      epic: null,
                    });
                    setIsChangeEpicModalOpen(false);
                    setSelectedItem(null);
                  }}
                >
                  <div className="w-4 h-4 mr-2"></div>
                  <span>None</span>
                </div>

                {epics.map((epic) => (
                  <div
                    key={epic.id}
                    className={`p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center ${
                      selectedItem.epic && selectedItem.epic.id === epic.id
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() => {
                      // Update the item with the new epic
                      handleUpdateItem({
                        ...selectedItem,
                        epic: epic,
                      });
                      setIsChangeEpicModalOpen(false);
                      setSelectedItem(null);
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: epic.color }}
                    ></div>
                    <span>{epic.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={() => setIsCreateEpicModalOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create New Epic
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default BacklogPage;
