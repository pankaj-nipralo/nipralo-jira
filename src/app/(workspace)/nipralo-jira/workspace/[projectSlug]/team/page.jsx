"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  BarChart2,
  CheckCircle,
  Clock,
  Search
} from "lucide-react";

const ProjectTeam = () => {
  const params = useParams();
  const { projectSlug } = params;
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock team data - in a real app, you would fetch this from an API
    const mockTeam = [
      { 
        id: 1, 
        name: "John Doe", 
        role: "Project Manager",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "JD",
        joinedDate: "2025-01-15",
        tasksCompleted: 12,
        tasksInProgress: 3,
        skills: ["Project Management", "Agile", "Leadership"],
        availability: "Full-time"
      },
      { 
        id: 2, 
        name: "Jane Smith", 
        role: "UI/UX Designer",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        avatar: "JS",
        joinedDate: "2025-01-20",
        tasksCompleted: 8,
        tasksInProgress: 2,
        skills: ["UI Design", "Wireframing", "Prototyping", "Figma"],
        availability: "Full-time"
      },
      { 
        id: 3, 
        name: "Mike Johnson", 
        role: "Senior Developer",
        email: "mike.johnson@example.com",
        phone: "+1 (555) 345-6789",
        avatar: "MJ",
        joinedDate: "2025-01-15",
        tasksCompleted: 15,
        tasksInProgress: 4,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        availability: "Full-time"
      },
      { 
        id: 4, 
        name: "Sarah Williams", 
        role: "QA Engineer",
        email: "sarah.williams@example.com",
        phone: "+1 (555) 456-7890",
        avatar: "SW",
        joinedDate: "2025-02-01",
        tasksCompleted: 6,
        tasksInProgress: 2,
        skills: ["Test Automation", "Manual Testing", "QA Processes"],
        availability: "Part-time"
      },
      { 
        id: 5, 
        name: "David Brown", 
        role: "Backend Developer",
        email: "david.brown@example.com",
        phone: "+1 (555) 567-8901",
        avatar: "DB",
        joinedDate: "2025-02-10",
        tasksCompleted: 9,
        tasksInProgress: 3,
        skills: ["Python", "Django", "PostgreSQL", "API Design"],
        availability: "Full-time"
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setTeam(mockTeam);
      setLoading(false);
    }, 500);
  }, [projectSlug]);

  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team for {projectSlug}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.length} Members</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.reduce((sum, member) => sum + member.tasksCompleted, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tasks In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.reduce((sum, member) => sum + member.tasksInProgress, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {team.filter(member => member.availability === 'Full-time').length} Full-time
            </div>
            <div className="text-sm text-gray-500">
              {team.filter(member => member.availability === 'Part-time').length} Part-time
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredTeam.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No team members found matching your search
              </div>
            ) : (
              filteredTeam.map(member => (
                <div key={member.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-lg font-bold flex items-center justify-center mr-4">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{member.name}</h3>
                        <p className="text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        View Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div className="mt-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Tasks</div>
                      <div className="mt-1">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>{member.tasksCompleted} Completed</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{member.tasksInProgress} In Progress</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Info</div>
                      <div className="mt-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Joined {new Date(member.joinedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <BarChart2 className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{member.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm text-gray-500 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
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

export default ProjectTeam;
