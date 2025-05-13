"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Save,
  Trash2,
  AlertTriangle,
  Users,
  Bell,
  Palette,
  FileText
} from "lucide-react";

const ProjectSettings = () => {
  const params = useParams();
  const { projectSlug } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // Mock project data - in a real app, you would fetch this from an API
    const mockProject = {
      id: projectSlug,
      name: `Project ${projectSlug}`,
      description: "A comprehensive project management system with task tracking and team collaboration features.",
      key: projectSlug.toUpperCase().substring(0, 3),
      createdAt: "2025-01-15",
      updatedAt: "2025-05-10",
      owner: "John Doe",
      visibility: "Private",
      category: "Software Development",
      status: "Active",
      members: [
        { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", avatar: "JD" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Member", avatar: "JS" },
        { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", role: "Member", avatar: "MJ" },
      ],
      notificationSettings: {
        emailNotifications: true,
        taskAssignments: true,
        taskComments: true,
        statusChanges: true,
        dailyDigest: false,
        weeklyDigest: true
      },
      appearance: {
        theme: "light",
        accentColor: "#6366F1",
        compactView: false,
        showAvatars: true
      }
    };

    // Simulate API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  const handleUpdateProject = (updatedData) => {
    setProject({
      ...project,
      ...updatedData
    });
    // In a real app, you would save this to the backend
    alert("Project settings updated successfully!");
  };

  const handleUpdateMembers = (updatedMembers) => {
    setProject({
      ...project,
      members: updatedMembers
    });
    // In a real app, you would save this to the backend
    alert("Project members updated successfully!");
  };

  const handleUpdateNotifications = (updatedSettings) => {
    setProject({
      ...project,
      notificationSettings: updatedSettings
    });
    // In a real app, you would save this to the backend
    alert("Notification settings updated successfully!");
  };

  const handleUpdateAppearance = (updatedAppearance) => {
    setProject({
      ...project,
      appearance: updatedAppearance
    });
    // In a real app, you would save this to the backend
    alert("Appearance settings updated successfully!");
  };

  const handleDeleteProject = () => {
    // In a real app, you would delete the project from the backend
    alert(`Project ${project.name} has been deleted.`);
    // Redirect to projects list
    window.location.href = "/nipralo-jira/workspace";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings for {project.name}</h1>
        <p className="text-gray-500">Manage your project settings, members, and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="general" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </TabsTrigger>
          {/* <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            <span>Appearance</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => setProject({...project, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Key</label>
                    <input
                      type="text"
                      value={project.key}
                      onChange={(e) => setProject({...project, key: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject({...project, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={project.category}
                      onChange={(e) => setProject({...project, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visibility</label>
                    <select
                      value={project.visibility}
                      onChange={(e) => setProject({...project, visibility: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Private">Private</option>
                      <option value="Team">Team</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleUpdateProject(project)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                These actions are destructive and cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center p-4 border border-red-200 rounded-md bg-red-50">
                <div>
                  <h3 className="font-medium">Delete this project</h3>
                  <p className="text-sm text-gray-500">
                    Once deleted, it will be gone forever. All data will be permanently deleted.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="mt-4 md:mt-0"
                  onClick={handleDeleteProject}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>
                Manage who has access to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Members ({project.members.length})</h3>
                  <Button onClick={() => {
                    const newMember = {
                      id: Date.now(),
                      name: "New Member",
                      email: "new.member@example.com",
                      role: "Member",
                      avatar: "NM"
                    };
                    handleUpdateMembers([...project.members, newMember]);
                  }}>
                    <Users className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {project.members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center mr-3">
                                {member.avatar}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => {
                                  const updatedMember = {...member, role: member.role === 'Admin' ? 'Member' : 'Admin'};
                                  handleUpdateMembers(project.members.map(m => m.id === member.id ? updatedMember : m));
                                }}
                              >
                                {member.role === 'Admin' ? 'Make Member' : 'Make Admin'}
                              </button>
                              {member.role !== 'Admin' && (
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    handleUpdateMembers(project.members.filter(m => m.id !== member.id));
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.notificationSettings.emailNotifications}
                        onChange={() => {
                          setProject({
                            ...project,
                            notificationSettings: {
                              ...project.notificationSettings,
                              emailNotifications: !project.notificationSettings.emailNotifications
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Task Assignments</h3>
                    <p className="text-sm text-gray-500">When you are assigned to a task</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.notificationSettings.taskAssignments}
                        onChange={() => {
                          setProject({
                            ...project,
                            notificationSettings: {
                              ...project.notificationSettings,
                              taskAssignments: !project.notificationSettings.taskAssignments
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Task Comments</h3>
                    <p className="text-sm text-gray-500">When someone comments on your tasks</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.notificationSettings.taskComments}
                        onChange={() => {
                          setProject({
                            ...project,
                            notificationSettings: {
                              ...project.notificationSettings,
                              taskComments: !project.notificationSettings.taskComments
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Status Changes</h3>
                    <p className="text-sm text-gray-500">When task status changes</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.notificationSettings.statusChanges}
                        onChange={() => {
                          setProject({
                            ...project,
                            notificationSettings: {
                              ...project.notificationSettings,
                              statusChanges: !project.notificationSettings.statusChanges
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleUpdateNotifications(project.notificationSettings)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the project looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${project.appearance.theme === 'light' ? 'border-purple-500 bg-purple-50' : ''}`}
                      onClick={() => setProject({
                        ...project,
                        appearance: {
                          ...project.appearance,
                          theme: 'light'
                        }
                      })}
                    >
                      <div className="h-20 bg-white border rounded-md mb-2"></div>
                      <div className="text-center">Light</div>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${project.appearance.theme === 'dark' ? 'border-purple-500 bg-purple-50' : ''}`}
                      onClick={() => setProject({
                        ...project,
                        appearance: {
                          ...project.appearance,
                          theme: 'dark'
                        }
                      })}
                    >
                      <div className="h-20 bg-gray-800 border rounded-md mb-2"></div>
                      <div className="text-center">Dark</div>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${project.appearance.theme === 'system' ? 'border-purple-500 bg-purple-50' : ''}`}
                      onClick={() => setProject({
                        ...project,
                        appearance: {
                          ...project.appearance,
                          theme: 'system'
                        }
                      })}
                    >
                      <div className="h-20 bg-gradient-to-r from-white to-gray-800 border rounded-md mb-2"></div>
                      <div className="text-center">System</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="grid grid-cols-6 gap-4">
                    {['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981'].map(color => (
                      <div
                        key={color}
                        className={`h-10 rounded-md cursor-pointer ${project.appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setProject({
                          ...project,
                          appearance: {
                            ...project.appearance,
                            accentColor: color
                          }
                        })}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Compact View</h3>
                    <p className="text-sm text-gray-500">Use a more compact layout</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.appearance.compactView}
                        onChange={() => {
                          setProject({
                            ...project,
                            appearance: {
                              ...project.appearance,
                              compactView: !project.appearance.compactView
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Show Avatars</h3>
                    <p className="text-sm text-gray-500">Display user avatars in the interface</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={project.appearance.showAvatars}
                        onChange={() => {
                          setProject({
                            ...project,
                            appearance: {
                              ...project.appearance,
                              showAvatars: !project.appearance.showAvatars
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleUpdateAppearance(project.appearance)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectSettings;
