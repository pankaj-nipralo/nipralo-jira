"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  BarChart2,
  Edit,
  Trash2,
} from "lucide-react";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import AddMemberModal from "@/components/dashboard/AddMemberModal";
import AddMilestoneModal from "@/components/dashboard/AddMilestoneModal";
import MemberProfileModal from "@/components/dashboard/MemberProfileModal";

const ProjectDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const { projectSlug } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isMemberProfileModalOpen, setIsMemberProfileModalOpen] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Mock project data - in a real app, you would fetch this from an API
    const mockProject = {
      id: projectSlug,
      name: `Project ${projectSlug}`,
      description:
        "A comprehensive project management system with task tracking and team collaboration features.",
      status: "In Progress",
      progress: 65,
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      tasks: {
        total: 48,
        completed: 31,
        inProgress: 12,
        pending: 5,
      },
      team: [
        { id: 1, name: "John Doe", role: "Project Manager", avatar: "JD" },
        { id: 2, name: "Jane Smith", role: "Designer", avatar: "JS" },
        { id: 3, name: "Mike Johnson", role: "Developer", avatar: "MJ" },
        { id: 4, name: "Sarah Williams", role: "QA Engineer", avatar: "SW" },
      ],
      upcomingMilestones: [
        {
          id: 1,
          title: "Design Phase Completion",
          date: "2025-03-15",
          status: "In Progress",
        },
        { id: 2, title: "Beta Release", date: "2025-04-30", status: "Pending" },
        {
          id: 3,
          title: "Final Delivery",
          date: "2025-06-30",
          status: "Pending",
        },
      ],
    };

    // Simulate API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-500">{project.description}</p>
          </div>
          <Button onClick={() => setIsAddTaskModalOpen(true)}>
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
          <span>
            {project.startDate} - {project.endDate}
          </span>
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
            <div className="text-2xl font-bold">
              {project.team.length} Members
            </div>
            <div className="flex mt-2">
              {project.team.map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center -ml-2 first:ml-0 border-2 border-white"
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center -ml-2 border-2 border-white cursor-pointer"
                onClick={() => setIsAddMemberModalOpen(true)}
              >
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
                <span>
                  {Math.floor(
                    (new Date(project.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days left
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Milestones</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => setIsAddMilestoneModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Milestone
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.upcomingMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex justify-between items-center p-3 border rounded-md hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(milestone.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      milestone.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : milestone.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {milestone.status}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      className="text-gray-400 hover:text-blue-500 p-1"
                      onClick={() => {
                        const newStatus =
                          milestone.status === "Pending"
                            ? "In Progress"
                            : milestone.status === "In Progress"
                            ? "Completed"
                            : "Pending";

                        const updatedMilestones =
                          project.upcomingMilestones.map((m) =>
                            m.id === milestone.id
                              ? { ...m, status: newStatus }
                              : m
                          );

                        setProject({
                          ...project,
                          upcomingMilestones: updatedMilestones,
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to remove this milestone?"
                          )
                        ) {
                          const updatedMilestones =
                            project.upcomingMilestones.filter(
                              (m) => m.id !== milestone.id
                            );
                          setProject({
                            ...project,
                            upcomingMilestones: updatedMilestones,
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.team.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 text-sm font-bold flex items-center justify-center mr-3">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsMemberProfileModalOpen(true);
                  }}
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={(newTask) => {
          // Update task counts
          const updatedTasks = {
            ...project.tasks,
            total: project.tasks.total + 1,
          };

          if (newTask.status === "Completed") {
            updatedTasks.completed = project.tasks.completed + 1;
          } else if (newTask.status === "In Progress") {
            updatedTasks.inProgress = project.tasks.inProgress + 1;
          } else {
            updatedTasks.pending = project.tasks.pending + 1;
          }

          // Update project
          setProject({
            ...project,
            tasks: updatedTasks,
          });

          // In a real app, you would save the task to the backend
          alert("Task added successfully!");

          // Navigate to tasks page
          router.push(`/nipralo-jira/workspace/${projectSlug}/tasks`);
        }}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={(newMember) => {
          // Add member to team
          const updatedTeam = [...project.team, newMember];

          // Update project
          setProject({
            ...project,
            team: updatedTeam,
          });

          // In a real app, you would save the member to the backend
          alert("Team member added successfully!");
        }}
      />

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onAddMilestone={(newMilestone) => {
          // Add milestone to project
          const updatedMilestones = [
            ...project.upcomingMilestones,
            newMilestone,
          ];

          // Update project
          setProject({
            ...project,
            upcomingMilestones: updatedMilestones,
          });

          // In a real app, you would save the milestone to the backend
          alert("Milestone added successfully!");
        }}
      />

      {/* Member Profile Modal */}
      <MemberProfileModal
        isOpen={isMemberProfileModalOpen}
        onClose={() => setIsMemberProfileModalOpen(false)}
        member={selectedMember}
        onUpdateMember={(updatedMember) => {
          // Update member in team
          const updatedTeam = project.team.map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          );

          // Update project
          setProject({
            ...project,
            team: updatedTeam,
          });

          // Update selected member
          setSelectedMember(updatedMember);

          // In a real app, you would save the updated member to the backend
          alert("Team member updated successfully!");
        }}
        onRemoveMember={(memberId) => {
          // Remove member from team
          const updatedTeam = project.team.filter(
            (member) => member.id !== memberId
          );

          // Update project
          setProject({
            ...project,
            team: updatedTeam,
          });

          // In a real app, you would delete the member from the backend
          alert("Team member removed successfully!");
        }}
      />
    </div>
  );
};

export default ProjectDashboard;
