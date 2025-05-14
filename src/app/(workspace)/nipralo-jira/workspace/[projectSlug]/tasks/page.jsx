"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal,
  X,
  Tag
} from "lucide-react";

const ProjectTasks = () => {
  const params = useParams();
  const { projectSlug } = params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    dueDate: new Date().toISOString().split('T')[0],
    tags: []
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Team members for assignee selection
  const teamMembers = [
    { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
    { id: 'user-3', name: 'Mike Johnson', avatar: 'MJ' },
    { id: 'user-4', name: 'Sarah Williams', avatar: 'SW' },
  ];

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const newTaskObj = {
      ...newTask,
      id: tasks.length + 1, // In a real app, this would be handled by the backend
    };

    setTasks([newTaskObj, ...tasks]);
    setShowAddTaskModal(false);

    // Reset the form
    setNewTask({
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      assignee: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
      dueDate: new Date().toISOString().split('T')[0],
      tags: []
    });
    setNewTagInput('');
  };

  // Handle adding a tag to the new task
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (newTask.tags.includes(newTagInput.trim())) return;

    setNewTask({
      ...newTask,
      tags: [...newTask.tags, newTagInput.trim()]
    });
    setNewTagInput('');
  };

  // Handle removing a tag from the new task
  const handleRemoveTag = (tagToRemove) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  useEffect(() => {
    // Mock tasks data - in a real app, you would fetch this from an API
    const mockTasks = [
      {
        id: 1,
        title: "Design system architecture",
        description: "Create the overall system architecture and component diagram",
        status: "Completed",
        priority: "High",
        assignee: { name: "John Doe", avatar: "JD" },
        dueDate: "2025-02-15",
        tags: ["Design", "Architecture"]
      },
      {
        id: 2,
        title: "Implement user authentication",
        description: "Set up user authentication with JWT and role-based access control",
        status: "In Progress",
        priority: "High",
        assignee: { name: "Mike Johnson", avatar: "MJ" },
        dueDate: "2025-03-01",
        tags: ["Backend", "Security"]
      },
      {
        id: 3,
        title: "Create dashboard UI",
        description: "Design and implement the main dashboard user interface",
        status: "In Progress",
        priority: "Medium",
        assignee: { name: "Jane Smith", avatar: "JS" },
        dueDate: "2025-03-10",
        tags: ["Frontend", "UI/UX"]
      },
      {
        id: 4,
        title: "Set up CI/CD pipeline",
        description: "Configure continuous integration and deployment pipeline",
        status: "Pending",
        priority: "Medium",
        assignee: { name: "Sarah Williams", avatar: "SW" },
        dueDate: "2025-03-15",
        tags: ["DevOps"]
      },
      {
        id: 5,
        title: "Implement data export functionality",
        description: "Add ability to export data in CSV and PDF formats",
        status: "Pending",
        priority: "Low",
        assignee: { name: "Mike Johnson", avatar: "MJ" },
        dueDate: "2025-03-20",
        tags: ["Backend", "Feature"]
      },
      {
        id: 6,
        title: "Write user documentation",
        description: "Create comprehensive user documentation and help guides",
        status: "Pending",
        priority: "Low",
        assignee: { name: "Jane Smith", avatar: "JS" },
        dueDate: "2025-04-01",
        tags: ["Documentation"]
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Filter tasks based on status and search query
  const filteredTasks = tasks
    .filter(task => filter === 'all' || task.status.toLowerCase() === filter)
    .filter(task => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.name.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks for {projectSlug}</h1>
        <Button onClick={() => setShowAddTaskModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="text-green-600"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </Button>
          <Button
            variant={filter === 'in progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('in progress')}
            className="text-blue-600"
          >
            <Clock className="h-4 w-4 mr-1" />
            In Progress
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
            className="text-yellow-600"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Pending
          </Button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks found matching your filters
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-medium ml-2">{task.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center mr-2">
                        {task.assignee.avatar}
                      </div>
                      <span>{task.assignee.name}</span>
                    </div>
                    <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for the project. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({...newTask, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={newTask.assignee.id}
                onValueChange={(value) => {
                  const selectedMember = teamMembers.find(member => member.id === value);
                  setNewTask({
                    ...newTask,
                    assignee: {
                      id: selectedMember.id,
                      name: selectedMember.name,
                      avatar: selectedMember.avatar
                    }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">
                        {newTask.assignee.avatar}
                      </div>
                      <span>{newTask.assignee.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <span>{member.name}</span>
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
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {newTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTask.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={!newTask.title.trim()}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTasks;
