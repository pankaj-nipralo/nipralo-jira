"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import ClientPageNav from "@/components/client/ClientPageNav";

const TasksPage = () => {
  const params = useParams();
  const { slug } = params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock tasks data - in a real app, you would fetch this from an API
    const mockTasks = [
      {
        id: 1,
        title: "Create wireframes",
        description: "Design initial wireframes for the homepage and product pages",
        status: "Completed",
        priority: "High",
        assignee: "John Doe",
        dueDate: "2025-05-20"
      },
      {
        id: 2,
        title: "Design homepage",
        description: "Create visual design for the homepage based on approved wireframes",
        status: "In Progress",
        priority: "Medium",
        assignee: "Jane Smith",
        dueDate: "2025-05-25"
      },
      {
        id: 3,
        title: "Implement responsive layout",
        description: "Develop responsive layout for all screen sizes",
        status: "To Do",
        priority: "Medium",
        assignee: "Unassigned",
        dueDate: "2025-06-01"
      },
      {
        id: 4,
        title: "Content integration",
        description: "Integrate client-provided content into the website",
        status: "To Do",
        priority: "Low",
        assignee: "Unassigned",
        dueDate: "2025-06-05"
      },
      {
        id: 5,
        title: "SEO optimization",
        description: "Implement SEO best practices across the website",
        status: "To Do",
        priority: "High",
        assignee: "Unassigned",
        dueDate: "2025-06-10"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, [slug]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <ClientPageNav clientId={slug} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks for Client {slug}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map(task => (
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
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <div>Assignee: {task.assignee}</div>
                  <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
