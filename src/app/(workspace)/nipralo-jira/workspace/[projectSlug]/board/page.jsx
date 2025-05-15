"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Search,
  Plus,
  Filter,
  User,
  AlertTriangle,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import the components we'll create
import KanbanColumn from '@/components/kanban/KanbanColumn';
import AddTaskModal from '@/components/kanban/AddTaskModal';
import StatusColumnModal from '@/components/kanban/StatusColumnModal';
import AddColumnButton from '@/components/kanban/AddColumnButton';

// Initial board statuses
const INITIAL_BOARD_STATUSES = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-100' },
  { id: 'inprogress', name: 'In Progress', color: 'bg-blue-100' },
  { id: 'testing', name: 'Testing', color: 'bg-purple-100' },
  { id: 'done', name: 'Done', color: 'bg-green-100' }
];

// Define task types
const TASK_TYPES = [
  { id: 'task', name: 'Task', icon: 'CheckSquare' },
  { id: 'bug', name: 'Bug', icon: 'AlertTriangle' },
  { id: 'story', name: 'Story', icon: 'Bookmark' }
];

// Define priorities
const PRIORITIES = [
  { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' },
  { id: 'medium', name: 'Medium', color: 'bg-orange-100 text-orange-800' },
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' }
];

const KanbanBoard = () => {
  const params = useParams();
  const { projectSlug } = params;

  // State for tasks and filters
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Status column states
  const [boardStatuses, setBoardStatuses] = useState(INITIAL_BOARD_STATUSES);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Filter states
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  // Team members for assignee selection............... Team api
  const teamMembers = [
    { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
    { id: 'user-3', name: 'Mike Johnson', avatar: 'MJ' },
    { id: 'user-4', name: 'Sarah Williams', avatar: 'SW' },
  ];

  // Load tasks
  useEffect(() => {
    // Mock tasks data - in a real app, you would fetch this from an API
    const mockTasks = [
      {
        id: "task-1",
        key: "CRM-18",
        title: "Create the about us page",
        description: "Design and implement the about us page with team information",
        type: "task",
        status: "todo",
        priority: "medium",
        assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
        reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
        created: "2023-05-10T10:30:00Z",
        updated: "2023-05-15T14:20:00Z",
        dueDate: "2023-05-20T17:00:00Z",
      },
      {
        id: "task-2",
        key: "CRM-17",
        title: "Implement user authentication",
        description: "Set up user authentication with JWT tokens",
        type: "task",
        status: "inprogress",
        priority: "high",
        assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
        reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
        created: "2023-05-08T11:20:00Z",
        updated: "2023-05-14T16:45:00Z",
        dueDate: "2023-05-18T12:00:00Z",
      },
      {
        id: "task-3",
        key: "CRM-16",
        title: "Design database schema",
        description: "Create the database schema for customer information",
        type: "task",
        status: "todo",
        priority: "high",
        assignee: { id: "user-3", name: "Robert Brown", avatar: "RB" },
        reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
        created: "2023-05-07T09:10:00Z",
        updated: "2023-05-07T09:10:00Z",
        dueDate: "2023-05-25T17:00:00Z",
      },
      {
        id: "task-4",
        key: "CRM-15",
        title: "Fix login page styling",
        description: "Fix the styling issues on the login page for mobile devices",
        type: "bug",
        status: "testing",
        priority: "medium",
        assignee: { id: "user-4", name: "Sarah Williams", avatar: "SW" },
        reporter: { id: "user-2", name: "Jane Smith", avatar: "JS" },
        created: "2023-05-06T15:30:00Z",
        updated: "2023-05-06T15:30:00Z",
        dueDate: "2023-05-15T17:00:00Z",
      },
      {
        id: "task-5",
        key: "CRM-14",
        title: "Create customer dashboard",
        description: "Implement the customer dashboard with key metrics",
        type: "story",
        status: "done",
        priority: "high",
        assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
        reporter: { id: "user-3", name: "Robert Brown", avatar: "RB" },
        created: "2023-05-05T10:00:00Z",
        updated: "2023-05-05T10:00:00Z",
        dueDate: "2023-06-01T17:00:00Z",
      },
      {
        id: "task-6",
        key: "CRM-13",
        title: "Implement email notifications",
        description: "Add email notification system for user actions",
        type: "task",
        status: "inprogress",
        priority: "medium",
        assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
        reporter: { id: "user-1", name: "John Doe", avatar: "JD" },
        created: "2023-05-04T09:15:00Z",
        updated: "2023-05-10T11:30:00Z",
        dueDate: "2023-05-22T17:00:00Z",
      },
      {
        id: "task-7",
        key: "CRM-12",
        title: "Add export to CSV feature",
        description: "Implement data export functionality to CSV format",
        type: "task",
        status: "done",
        priority: "low",
        assignee: { id: "user-3", name: "Mike Johnson", avatar: "MJ" },
        reporter: { id: "user-1", name: "John Doe", avatar: "JD" },
        created: "2023-05-03T14:20:00Z",
        updated: "2023-05-12T16:45:00Z",
        dueDate: "2023-05-17T17:00:00Z",
      },
      {
        id: "task-8",
        key: "CRM-11",
        title: "Fix pagination bug",
        description: "Fix the pagination issue on the customer list page",
        type: "bug",
        status: "testing",
        priority: "high",
        assignee: { id: "user-4", name: "Sarah Williams", avatar: "SW" },
        reporter: { id: "user-2", name: "Jane Smith", avatar: "JS" },
        created: "2023-05-02T10:30:00Z",
        updated: "2023-05-09T15:20:00Z",
        dueDate: "2023-05-16T17:00:00Z",
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.key.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply assignee filter
    if (assigneeFilter.length > 0) {
      result = result.filter(task =>
        task.assignee && assigneeFilter.includes(task.assignee.id)
      );
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      result = result.filter(task =>
        priorityFilter.includes(task.priority)
      );
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      result = result.filter(task =>
        typeFilter.includes(task.type)
      );
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, assigneeFilter, priorityFilter, typeFilter]);

  // Handle moving a task between columns
  const handleMoveTask = useCallback((taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  // Handle adding a new status column
  const handleAddStatus = (newStatus) => {
    setBoardStatuses(prev => [...prev, newStatus]);
  };

  // Handle editing a status column
  const handleEditStatus = (updatedStatus) => {
    setBoardStatuses(prev =>
      prev.map(status =>
        status.id === updatedStatus.id ? updatedStatus : status
      )
    );

    // If tasks are using this status, we need to update them too
    // This is only needed if the status ID changed, which we're not doing in this implementation
  };

  // Open the status modal for adding a new column
  const handleAddColumnClick = () => {
    setSelectedStatus(null);
    setShowStatusModal(true);
  };

  // Open the status modal for editing an existing column
  const handleEditColumnClick = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  // Handle deleting a status column
  const handleDeleteColumn = (statusId) => {
    // Check if there are tasks using this status
    const tasksUsingStatus = tasks.filter(task => task.status === statusId);

    if (tasksUsingStatus.length > 0) {
      // If there are tasks using this status, ask for confirmation and explain the impact
      const confirmDelete = window.confirm(
        `This column contains ${tasksUsingStatus.length} task(s). Deleting it will move these tasks to the first column. Continue?`
      );

      if (!confirmDelete) return;

      // Move tasks to the first available column
      const firstAvailableStatus = boardStatuses.find(s => s.id !== statusId)?.id;

      if (firstAvailableStatus) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.status === statusId ? { ...task, status: firstAvailableStatus } : task
          )
        );
      }
    }

    // Remove the status column
    setBoardStatuses(prev => prev.filter(status => status.id !== statusId));
  };

  // Handle adding a new task
  const handleAddTask = (newTask) => {
    // Generate a new task ID and key
    const taskId = `task-${tasks.length + 1}`;
    const taskKey = `CRM-${19 + tasks.length}`; // Assuming CRM-18 is the last one

    const taskToAdd = {
      id: taskId,
      key: taskKey,
      ...newTask,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    setTasks(prevTasks => [taskToAdd, ...prevTasks]);
    setShowAddTaskModal(false);
  };

  // Handle editing a task
  const handleEditTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...updatedTask, updated: new Date().toISOString() } : task
      )
    );
    setSelectedTask(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setAssigneeFilter([]);
    setPriorityFilter([]);
    setTypeFilter([]);
  };

  // Group tasks by status
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        {/* Board Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Board: {projectSlug}</h1>
          <Button onClick={() => setShowAddTaskModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Task
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Assignee Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <User className="h-4 w-4 mr-2" /> Assignee <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {teamMembers.map(member => (
                  <DropdownMenuCheckboxItem
                    key={member.id}
                    checked={assigneeFilter.includes(member.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAssigneeFilter(prev => [...prev, member.id]);
                      } else {
                        setAssigneeFilter(prev => prev.filter(id => id !== member.id));
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setAssigneeFilter([])}>
                  Clear assignee filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <AlertTriangle className="h-4 w-4 mr-2" /> Priority <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {PRIORITIES.map(priority => (
                  <DropdownMenuCheckboxItem
                    key={priority.id}
                    checked={priorityFilter.includes(priority.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter(prev => [...prev, priority.id]);
                      } else {
                        setPriorityFilter(prev => prev.filter(id => id !== priority.id));
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs mr-2 ${priority.color}`}>
                        {priority.name}
                      </span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriorityFilter([])}>
                  Clear priority filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" /> Type <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {TASK_TYPES.map(type => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={typeFilter.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTypeFilter(prev => [...prev, type.id]);
                      } else {
                        setTypeFilter(prev => prev.filter(id => id !== type.id));
                      }
                    }}
                  >
                    {type.name}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter([])}>
                  Clear type filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear All Filters */}
            {(searchQuery || assigneeFilter.length > 0 || priorityFilter.length > 0 || typeFilter.length > 0) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {boardStatuses.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              tasks={getTasksByStatus(status.id)}
              onMoveTask={handleMoveTask}
              onEditTask={(task) => setSelectedTask(task)}
              onEditColumn={handleEditColumnClick}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
          <AddColumnButton onClick={handleAddColumnClick} />
        </div>

        {/* Add Task Modal */}
        {showAddTaskModal && (
          <AddTaskModal
            isOpen={showAddTaskModal}
            onClose={() => setShowAddTaskModal(false)}
            onAddTask={handleAddTask}
            statuses={boardStatuses}
            priorities={PRIORITIES}
            taskTypes={TASK_TYPES}
            teamMembers={teamMembers}
          />
        )}

        {/* Status Column Modal */}
        <StatusColumnModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onSave={selectedStatus ? handleEditStatus : handleAddStatus}
          existingStatus={selectedStatus}
          existingStatuses={boardStatuses}
        />

        {/* Edit Task Modal */}
        {selectedTask && (
          <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Task: {selectedTask.key}</DialogTitle>
                <DialogDescription>
                  Update the task details below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedTask.description}
                    onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedTask.status}
                      onValueChange={(value) => setSelectedTask({...selectedTask, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {boardStatuses.map(status => (
                          <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={selectedTask.priority}
                      onValueChange={(value) => setSelectedTask({...selectedTask, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority.id} value={priority.id}>{priority.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={selectedTask.type}
                    onValueChange={(value) => setSelectedTask({...selectedTask, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    value={selectedTask.assignee?.id}
                    onValueChange={(value) => {
                      const selectedMember = teamMembers.find(member => member.id === value);
                      setSelectedTask({
                        ...selectedTask,
                        assignee: selectedMember
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask,
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null
                    })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditTask(selectedTask)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
