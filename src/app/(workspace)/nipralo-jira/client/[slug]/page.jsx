"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageSquare, Users, Plus } from "lucide-react";
import ClientPageNav from "@/components/client/ClientPageNav";

const ClientDetailPage = () => {
  const params = useParams();
  const { slug } = params;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock client data - in a real app, you would fetch this from an API
    const mockClient = {
      id: slug,
      name: `Client ${slug}`,
      project: "Website Redesign",
      phone: "123-456-7890",
      email: "client@example.com",
      resourcePending: "Design Assets",
      summary: "Needs homepage mockups and responsive design implementation",
      resources: [
        { id: 1, name: "UI Design", date: "20 May 2025, 10:00 AM", status: "Pending" },
        { id: 2, name: "Content", date: "21 May 2025, 02:00 PM", status: "Approved" },
      ],
      tasks: [
        { id: 1, title: "Create wireframes", status: "Completed", assignee: "John Doe" },
        { id: 2, title: "Design homepage", status: "In Progress", assignee: "Jane Smith" },
        { id: 3, title: "Implement responsive layout", status: "To Do", assignee: "Unassigned" },
      ],
      meetings: [
        { id: 1, title: "Project Kickoff", date: "15 May 2025, 09:00 AM", attendees: 5 },
        { id: 2, title: "Design Review", date: "22 May 2025, 02:00 PM", attendees: 3 },
      ],
      documents: [
        { id: 1, name: "Project Brief.pdf", uploadedBy: "Admin", date: "10 May 2025" },
        { id: 2, name: "Design Guidelines.docx", uploadedBy: "Designer", date: "12 May 2025" },
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setClient(mockClient);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <ClientPageNav clientId={slug} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <p className="text-gray-500">{client.project}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList> */}

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{client.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Project:</span>
                    <span>{client.project}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{client.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resources</CardTitle>
                <Button size="sm" variant="outline" className="h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.resources.map(resource => (
                    <div key={resource.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.date}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        resource.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
{/* 
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> New Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {client.tasks.map(task => (
                  <div key={task.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">Assignee: {task.assignee}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Scheduled Meetings</CardTitle>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Schedule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {client.meetings.map(meeting => (
                  <div key={meeting.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-gray-500">{meeting.date}</div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{meeting.attendees}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Upload
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {client.documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">Uploaded by: {doc.uploadedBy}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{doc.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default ClientDetailPage;
