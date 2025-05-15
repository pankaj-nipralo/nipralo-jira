"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  X,
  CheckSquare,
  AlertCircle,
  Bookmark,
  ArrowUp,
  ArrowDown,
  CalendarClock,
  Timer,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WorkItemDetails from "@/components/work/WorkItemDetails";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllWorkPage = () => {
  const params = useParams();
  const { projectSlug } = params;

  // State for work items and filters
  const [workItems, setWorkItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all"); // all, overdue, thisWeek, nextWeek

  // Sort states
  const [sortField, setSortField] = useState("updated");
  const [sortDirection, setSortDirection] = useState("desc"); // asc or desc

  // Fetch work items (using dummy data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyData = generateDummyData();
      setWorkItems(dummyData.workItems);
      setFilteredItems(dummyData.workItems);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  // Apply filters and sorting when any filter changes
  useEffect(() => {
    let filtered = [...workItems];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.key.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)
      );
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((item) => item.project === projectFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((item) =>
        assigneeFilter === "unassigned"
          ? !item.assignee
          : item.assignee?.id === assigneeFilter
      );
    }

    // Apply due date filter
    if (dueDateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const twoWeeks = new Date(today);
      twoWeeks.setDate(today.getDate() + 14);

      filtered = filtered.filter((item) => {
        if (!item.dueDate) return false;

        const dueDate = new Date(item.dueDate);

        switch (dueDateFilter) {
          case "overdue":
            return dueDate < today;
          case "today":
            return (
              dueDate.getDate() === today.getDate() &&
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear()
            );
          case "thisWeek":
            return dueDate >= today && dueDate < nextWeek;
          case "nextWeek":
            return dueDate >= nextWeek && dueDate < twoWeeks;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case "key":
          // Extract numeric part for proper sorting
          valueA = parseInt(a.key.replace(/\D/g, ""));
          valueB = parseInt(b.key.replace(/\D/g, ""));
          break;
        case "priority":
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          valueA = priorityOrder[a.priority] || 999;
          valueB = priorityOrder[b.priority] || 999;
          break;
        case "dueDate":
          valueA = a.dueDate
            ? new Date(a.dueDate).getTime()
            : Number.MAX_SAFE_INTEGER;
          valueB = b.dueDate
            ? new Date(b.dueDate).getTime()
            : Number.MAX_SAFE_INTEGER;
          break;
        case "timeEstimate":
          // Convert all estimates to minutes for comparison
          valueA = a.timeEstimate ? convertToMinutes(a.timeEstimate) : 0;
          valueB = b.timeEstimate ? convertToMinutes(b.timeEstimate) : 0;
          break;
        default:
          valueA = a[sortField];
          valueB = b[sortField];

          // Handle dates
          if (sortField === "created" || sortField === "updated") {
            valueA = new Date(valueA).getTime();
            valueB = new Date(valueB).getTime();
          }
      }

      // Apply sort direction
      const direction = sortDirection === "asc" ? 1 : -1;

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });

    setFilteredItems(filtered);
  }, [
    searchQuery,
    projectFilter,
    typeFilter,
    statusFilter,
    assigneeFilter,
    dueDateFilter,
    sortField,
    sortDirection,
    workItems,
  ]);

  // Convert time estimate to minutes for sorting
  const convertToMinutes = (estimate) => {
    const { value, unit } = estimate;
    const numValue = parseFloat(value);

    switch (unit) {
      case "minutes":
        return numValue;
      case "hours":
        return numValue * 60;
      case "days":
        return numValue * 60 * 8; // Assuming 8-hour workdays
      case "weeks":
        return numValue * 60 * 8 * 5; // Assuming 5-day workweeks
      default:
        return numValue;
    }
  };

  // Format date to readable format
  const formatDate = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Handle selecting an item to view details
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  // Handle updating a work item
  const handleUpdateItem = (updatedItem) => {
    // Update the item in the workItems array
    const updatedItems = workItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    setWorkItems(updatedItems);
    setSelectedItem(updatedItem);
  };

  // Generate dummy data for the work items
  const generateDummyData = () => {
    return {
      workItems: [
        {
          id: "item-1",
          key: "CRM-18",
          summary: "Create the about us page",
          description:
            "Design and implement the about us page with team information",
          type: "task",
          status: "DONE",
          priority: "Medium",
          assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
          reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          created: "2023-05-10T10:30:00Z",
          updated: "2023-05-15T14:20:00Z",
          project: "CRM",
          sprint: { id: "sprint-1", name: "CRM Sprint 1" },
          labels: ["UI", "Frontend"],
          dueDate: "2023-05-20T17:00:00Z",
          timeEstimate: { value: "4", unit: "hours" },
          activity: [
            {
              id: "act-1",
              type: "status",
              from: "TO DO",
              to: "IN PROGRESS",
              user: { id: "user-1", name: "John Doe", avatar: "JD" },
              timestamp: "2023-05-12T09:15:00Z",
            },
            {
              id: "act-2",
              type: "status",
              from: "IN PROGRESS",
              to: "DONE",
              user: { id: "user-1", name: "John Doe", avatar: "JD" },
              timestamp: "2023-05-15T14:20:00Z",
            },
          ],
        },
        {
          id: "item-2",
          key: "CRM-17",
          summary: "Implement user authentication",
          description: "Set up user authentication with JWT tokens",
          type: "task",
          status: "IN PROGRESS",
          priority: "High",
          assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
          reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          created: "2023-05-08T11:20:00Z",
          updated: "2023-05-14T16:45:00Z",
          project: "CRM",
          sprint: { id: "sprint-1", name: "CRM Sprint 1" },
          labels: ["Backend", "Security"],
          dueDate: "2023-05-18T12:00:00Z",
          timeEstimate: { value: "8", unit: "hours" },
          activity: [
            {
              id: "act-3",
              type: "status",
              from: "TO DO",
              to: "IN PROGRESS",
              user: { id: "user-2", name: "Jane Smith", avatar: "JS" },
              timestamp: "2023-05-14T16:45:00Z",
            },
          ],
        },
        {
          id: "item-3",
          key: "CRM-16",
          summary: "Design database schema",
          description: "Create the database schema for customer information",
          type: "task",
          status: "TO DO",
          priority: "High",
          assignee: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          created: "2023-05-07T09:10:00Z",
          updated: "2023-05-07T09:10:00Z",
          project: "CRM",
          sprint: { id: "sprint-1", name: "CRM Sprint 1" },
          labels: ["Database", "Backend"],
          dueDate: "2023-05-25T17:00:00Z",
          timeEstimate: { value: "2", unit: "days" },
          activity: [],
        },
        {
          id: "item-4",
          key: "CRM-15",
          summary: "Fix login page styling",
          description:
            "Fix the styling issues on the login page for mobile devices",
          type: "bug",
          status: "TO DO",
          priority: "Medium",
          assignee: null,
          reporter: { id: "user-2", name: "Jane Smith", avatar: "JS" },
          created: "2023-05-06T15:30:00Z",
          updated: "2023-05-06T15:30:00Z",
          project: "CRM",
          sprint: { id: "sprint-1", name: "CRM Sprint 1" },
          labels: ["UI", "Bug", "Mobile"],
          dueDate: "2023-05-15T17:00:00Z", // Past due date
          timeEstimate: { value: "3", unit: "hours" },
          activity: [],
        },
        {
          id: "item-5",
          key: "CRM-14",
          summary: "Create customer dashboard",
          description: "Implement the customer dashboard with key metrics",
          type: "story",
          status: "TO DO",
          priority: "High",
          assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
          reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
          created: "2023-05-05T10:00:00Z",
          updated: "2023-05-05T10:00:00Z",
          project: "CRM",
          sprint: { id: "sprint-2", name: "CRM Sprint 2" },
          labels: ["UI", "Dashboard"],
          timeEstimate: { value: "1", unit: "week" },
          activity: [],
        },
      ],
    };
  };

  // Get icon for work item type
  const getTypeIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "bug":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "story":
        return <Bookmark className="h-4 w-4 text-green-500" />;
      default:
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get color for priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <ArrowUp className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <ArrowUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Get background color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "TO DO":
        return "bg-gray-100 text-gray-800";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // if (loading) {
  //   return (
  //     // <div className="flex justify-center items-center h-full">Loading...</div>
  //     <div className="flex justify-center items-center h-full">
  //       <Skeleton count={5} width={1000} height={50} className="my-4" />
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        {loading ? (
          <Skeleton width={100} height={30} />
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">All Work</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mx-1">/</span>
              <span>{projectSlug}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton width={100} height={30} />
          ) : (
            <Button variant="outline" size="sm">
              Export
            </Button>
          )}
          {loading ? (
            <Skeleton width={100} height={30} />
          ) : (
            <Button variant="outline" size="sm">
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {loading ? (
        <Skeleton width={1000} height={30}  className="mb-4" />
      ) : (
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search work items"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                Project <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setProjectFilter("all")}>
                All Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProjectFilter("CRM")}>
                CRM
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                Type <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("task")}>
                <CheckSquare className="h-4 w-4 text-blue-500 mr-2" /> Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("bug")}>
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" /> Bug
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("story")}>
                <Bookmark className="h-4 w-4 text-green-500 mr-2" /> Story
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                Status <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("TO DO")}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("IN PROGRESS")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("DONE")}>
                Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                Assignee <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setAssigneeFilter("all")}>
                All Assignees
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssigneeFilter("unassigned")}>
                Unassigned
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAssigneeFilter("user-1")}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssigneeFilter("user-2")}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <span>Jane Smith</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssigneeFilter("user-3")}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>RB</AvatarFallback>
                  </Avatar>
                  <span>Robert Brown</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <CalendarClock className="h-4 w-4 mr-1" /> Due Date{" "}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDueDateFilter("all")}>
                All Due Dates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("overdue")}>
                <div className="flex items-center gap-2 text-red-500">
                  Overdue
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("today")}>
                Due Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("thisWeek")}>
                Due This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("nextWeek")}>
                Due Next Week
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setProjectFilter("all");
              setTypeFilter("all");
              setStatusFilter("all");
              setAssigneeFilter("all");
              setDueDateFilter("all");
              setSortField("updated");
              setSortDirection("desc");
            }}
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      )}

      {loading ? (
        <Skeleton width={1160} height={30} count={5} className="mb-4" />
      ) : (
      // Work Items Table 
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead
                className="w-[80px] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortField("key");
                  setSortDirection(
                    sortField === "key" && sortDirection === "asc"
                      ? "desc"
                      : "asc"
                  );
                }}
              >
                <div className="flex items-center">
                  Key
                  {sortField === "key" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[40px]">Type</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Assignee</TableHead>
              <TableHead
                className="w-[80px] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortField("priority");
                  setSortDirection(
                    sortField === "priority" && sortDirection === "asc"
                      ? "desc"
                      : "asc"
                  );
                }}
              >
                <div className="flex items-center">
                  Priority
                  {sortField === "priority" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortField("dueDate");
                  setSortDirection(
                    sortField === "dueDate" && sortDirection === "asc"
                      ? "desc"
                      : "asc"
                  );
                }}
              >
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  Due Date
                  {sortField === "dueDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="w-[100px] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortField("timeEstimate");
                  setSortDirection(
                    sortField === "timeEstimate" && sortDirection === "asc"
                      ? "desc"
                      : "asc"
                  );
                }}
              >
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  Estimate
                  {sortField === "timeEstimate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No work items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`cursor-pointer ${
                    selectedItem?.id === item.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <TableCell>
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                  </TableCell>
                  <TableCell className="font-medium">{item.key}</TableCell>
                  <TableCell>{getTypeIcon(item.type)}</TableCell>
                  <TableCell>
                    <div>
                      {item.summary}
                      {item.labels && item.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.labels.map((label, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {item.assignee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(item.priority)}
                      <span className="text-sm">{item.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.dueDate ? (
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          new Date(item.dueDate) < new Date()
                            ? "text-red-500 font-medium"
                            : ""
                        }`}
                      >
                        <CalendarClock className="h-4 w-4" />
                        {formatDate(new Date(item.dueDate))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No due date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.timeEstimate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {item.timeEstimate.value} {item.timeEstimate.unit}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Not estimated
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      )}

      {/* Work Item Details Panel */}
      {detailsOpen && selectedItem && (
        <WorkItemDetails
          item={selectedItem}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
};

export default AllWorkPage;
