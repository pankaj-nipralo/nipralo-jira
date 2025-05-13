"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Video, Clock } from "lucide-react";
import ClientPageNav from "@/components/client/ClientPageNav";

const MeetingsPage = () => {
  const params = useParams();
  const { slug } = params;
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock meetings data - in a real app, you would fetch this from an API
    const mockMeetings = [
      {
        id: 1,
        title: "Project Kickoff",
        description: "Initial meeting to discuss project scope and timeline",
        date: "2025-05-15T09:00:00",
        duration: 60, // minutes
        attendees: ["John Doe", "Jane Smith", "Client Representative", "Project Manager"],
        location: "Zoom",
        status: "Completed"
      },
      {
        id: 2,
        title: "Design Review",
        description: "Review initial design concepts and gather feedback",
        date: "2025-05-22T14:00:00",
        duration: 45, // minutes
        attendees: ["John Doe", "Jane Smith", "Client Representative"],
        location: "Google Meet",
        status: "Scheduled"
      },
      {
        id: 3,
        title: "Development Progress",
        description: "Update on development progress and next steps",
        date: "2025-06-05T10:30:00",
        duration: 30, // minutes
        attendees: ["John Doe", "Project Manager", "Client Representative"],
        location: "Office - Meeting Room 2",
        status: "Scheduled"
      },
      {
        id: 4,
        title: "Final Review",
        description: "Final review before project launch",
        date: "2025-06-20T15:00:00",
        duration: 90, // minutes
        attendees: ["John Doe", "Jane Smith", "Project Manager", "Client Team"],
        location: "Zoom",
        status: "Scheduled"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setMeetings(mockMeetings);
      setLoading(false);
    }, 500);
  }, [slug]);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (location) => {
    if (location.toLowerCase().includes('zoom')) {
      return <Video className="h-4 w-4 text-blue-500" />;
    } else if (location.toLowerCase().includes('google meet')) {
      return <Video className="h-4 w-4 text-green-500" />;
    } else {
      return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <ClientPageNav clientId={slug} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meetings with Client {slug}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Schedule Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{meeting.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusClass(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{meeting.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{meeting.duration} minutes</span>
                  </div>

                  <div className="flex items-center">
                    {getLocationIcon(meeting.location)}
                    <span className="ml-2">{meeting.location}</span>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Attendees:</h4>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsPage;
