"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";

const ProjectTasks = () => {
  const params = useParams();
  const { projectSlug } = params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status.toLowerCase() === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks for {projectSlug}</h1>
        <Button>
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
    </div>
  );
};

export default ProjectTasks;
