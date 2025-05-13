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
  Users, 
  Calendar, 
  BarChart2 
} from "lucide-react";

const ProjectDashboard = () => {
  const params = useParams();
  const { projectSlug } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock project data - in a real app, you would fetch this from an API
    const mockProject = {
      id: projectSlug,
      name: `Project ${projectSlug}`,
      description: "A comprehensive project management system with task tracking and team collaboration features.",
      status: "In Progress",
      progress: 65,
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      tasks: {
        total: 48,
        completed: 31,
        inProgress: 12,
        pending: 5
      },
      team: [
        { id: 1, name: "John Doe", role: "Project Manager", avatar: "JD" },
        { id: 2, name: "Jane Smith", role: "Designer", avatar: "JS" },
        { id: 3, name: "Mike Johnson", role: "Developer", avatar: "MJ" },
        { id: 4, name: "Sarah Williams", role: "QA Engineer", avatar: "SW" },
      ],
      upcomingMilestones: [
        { id: 1, title: "Design Phase Completion", date: "2025-03-15", status: "In Progress" },
        { id: 2, title: "Beta Release", date: "2025-04-30", status: "Pending" },
        { id: 3, title: "Final Delivery", date: "2025-06-30", status: "Pending" },
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-500">{project.description}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
        
        <div className="mt-4 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-purple-600 h-full rounded-full" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>Progress: {project.progress}%</span>
          <span>{project.startDate} - {project.endDate}</span>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.tasks.total}</div>
            <div className="flex justify-between mt-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span>{project.tasks.completed} Completed</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span>{project.tasks.inProgress} In Progress</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{project.tasks.pending} Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team.length} Members</div>
            <div className="flex mt-2">
              {project.team.map((member, index) => (
                <div 
                  key={member.id} 
                  className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center -ml-2 first:ml-0 border-2 border-white"
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center -ml-2 border-2 border-white">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.status}</div>
            <div className="flex justify-between mt-2 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span>{Math.floor((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-gray-500">Due: {new Date(milestone.date).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  milestone.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : milestone.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {milestone.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.team.map(member => (
              <div key={member.id} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 text-sm font-bold flex items-center justify-center mr-3">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">View Profile</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;
