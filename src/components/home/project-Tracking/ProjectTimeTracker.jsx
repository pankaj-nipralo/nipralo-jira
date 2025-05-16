"use client";

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderGit2, Users, Calendar } from "lucide-react";
import { teamMembers, projects } from './timeTrackingData';

const ProjectTimeTracker = ({ timeEntries }) => {
  // State for active tab (used by the Tabs component)
  const [, setActiveTab] = useState("team");

  // Get team members for columns
  const teamMemberColumns = useMemo(() => {
    // Use the imported team members data
    return teamMembers.map(member => ({
      id: member.id,
      name: member.name
    }));
  }, []);

  // Get the last 7 days for time view
  const timeColumns = useMemo(() => {
    // Get all dates from time entries
    const dates = timeEntries.map(entry => new Date(entry.date));

    // Sort dates in descending order (newest first)
    dates.sort((a, b) => b - a);

    // Get unique dates (using date string as key)
    const uniqueDates = [];
    const dateMap = new Map();

    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, true);
        uniqueDates.push(date);
      }
    });

    // Take the most recent 7 days
    const recentDates = uniqueDates.slice(0, 7);

    // Format dates for display
    return recentDates.map(date => {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      return {
        id: date.toISOString().split('T')[0], // YYYY-MM-DD format as ID
        label: `${day} ${month}` // e.g., "15 Jun"
      };
    });
  }, [timeEntries]);

  // Calculate hours by project and team member (for Team View)
  const projectTeamData = useMemo(() => {
    // Initialize project map with all projects from the projects array
    const projectMap = {};

    // Initialize all projects first
    projects.forEach(project => {
      projectMap[project.id] = {
        id: project.id,
        name: project.name,
        teamMembers: {}, // Initialize empty team members object
        total: 0
      };

      // Initialize all team members with 0 hours for each project
      teamMembers.forEach(member => {
        projectMap[project.id].teamMembers[member.id] = 0;
      });
    });

    // Process time entries to populate the project data
    timeEntries.forEach(entry => {
      // Support both naming conventions (project and epic)
      const projectId = entry.projectId || entry.epicId;
      const teamMemberId = entry.teamMemberId;

      if (!projectId || !teamMemberId) return; // Skip entries without project or team member ID
      if (!projectMap[projectId]) return; // Skip if project doesn't exist in our projects list

      // Add hours to the team member and total
      projectMap[projectId].teamMembers[teamMemberId] += entry.timeSpent;
      projectMap[projectId].total += entry.timeSpent;
    });

    // Convert to array and sort by total hours (descending)
    return Object.values(projectMap).sort((a, b) => b.total - a.total);
  }, [timeEntries]);

  // Calculate hours by project and date (for Time View)
  const projectTimeData = useMemo(() => {
    // Initialize project map with all projects from the projects array
    const projectMap = {};

    // Initialize all projects first
    projects.forEach(project => {
      projectMap[project.id] = {
        id: project.id,
        name: project.name,
        dates: {}, // Initialize empty dates object
        total: 0
      };

      // Initialize all dates with 0 hours for each project
      timeColumns.forEach(date => {
        projectMap[project.id].dates[date.id] = 0;
      });
    });

    // Process time entries to populate the project data
    timeEntries.forEach(entry => {
      // Support both naming conventions (project and epic)
      const projectId = entry.projectId || entry.epicId;

      if (!projectId) return; // Skip entries without project ID
      if (!projectMap[projectId]) return; // Skip if project doesn't exist in our projects list

      // Get the date in YYYY-MM-DD format
      const entryDate = new Date(entry.date).toISOString().split('T')[0];

      // Check if this date is in our timeColumns
      if (timeColumns.some(col => col.id === entryDate)) {
        // Add hours to the date and total
        if (!projectMap[projectId].dates[entryDate]) {
          projectMap[projectId].dates[entryDate] = 0;
        }
        projectMap[projectId].dates[entryDate] += entry.timeSpent;
        projectMap[projectId].total += entry.timeSpent;
      }
    });

    // Convert to array and sort by total hours (descending)
    return Object.values(projectMap).sort((a, b) => b.total - a.total);
  }, [timeEntries, timeColumns]);

  // Calculate column totals for Team View
  const teamColumnTotals = useMemo(() => {
    const totals = { total: 0 };

    // Initialize totals for each team member
    teamMemberColumns.forEach(member => {
      totals[member.id] = 0;
    });

    // Sum up hours for each team member across all projects
    projectTeamData.forEach(project => {
      teamMemberColumns.forEach(member => {
        const hours = project.teamMembers[member.id] || 0;
        totals[member.id] += hours;
      });
      totals.total += project.total;
    });

    return totals;
  }, [projectTeamData, teamMemberColumns]);

  // Calculate column totals for Time View
  const timeColumnTotals = useMemo(() => {
    const totals = { total: 0 };

    // Initialize totals for each date
    timeColumns.forEach(date => {
      totals[date.id] = 0;
    });

    // Sum up hours for each date across all projects
    projectTimeData.forEach(project => {
      timeColumns.forEach(date => {
        const hours = project.dates[date.id] || 0;
        totals[date.id] += hours;
      });
      totals.total += project.total;
    });

    return totals;
  }, [projectTimeData, timeColumns]);

  // Format hours with 1 decimal place
  const formatHours = (hours) => {
    return hours ? hours.toFixed(1) : '0.0';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FolderGit2 className="h-5 w-5 mr-2 text-primary" />
          Project Time Tracker
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track project hours by team members or time periods
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="team" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full max-w-[400px]">
            <TabsTrigger value="team" className="flex items-center flex-1">
              <Users className="h-4 w-4 mr-2" />
              Team View
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Time View
            </TabsTrigger>
          </TabsList>

          {/* Team View Tab Content */}
          <TabsContent value="team" className="mt-0">
            <div className="overflow-x-auto">
              <Table className="border-collapse">
                <TableHeader>
                  {/* Team Members group header */}
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[200px] min-w-[150px] sticky left-0 bg-muted/30 z-10 border-r"></TableHead>
                    <TableHead
                      colSpan={teamMemberColumns.length}
                      className="text-center font-bold"
                    >
                      Team Members
                    </TableHead>
                    <TableHead className="text-center font-bold bg-muted/30 min-w-[100px]">Total</TableHead>
                  </TableRow>

                  {/* Column headers */}
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px] min-w-[150px] sticky left-0 bg-muted/50 z-10 border-r">Project</TableHead>
                    {teamMemberColumns.map(member => (
                      <TableHead key={member.id} className="text-center min-w-[100px]">
                        {member.name}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold bg-muted/30 min-w-[100px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTeamData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={teamMemberColumns.length + 2} className="text-center py-8 text-gray-500">
                        No project time data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectTeamData.map((project, index) => (
                      <TableRow key={project.id} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                        <TableCell
                          className={`font-medium sticky left-0 z-10 border-r ${
                            index % 2 === 0 ? 'bg-muted/10' : 'bg-white'
                          }`}
                        >
                          {project.name}
                        </TableCell>
                        {teamMemberColumns.map(member => (
                          <TableCell key={member.id} className="text-center">
                            {project.teamMembers[member.id] ? (
                              <span className="font-medium">{formatHours(project.teamMembers[member.id])}h</span>
                            ) : (
                              <span className="text-gray-400">0h 0m </span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold bg-muted/10">
                          {formatHours(project.total)} hrs
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold sticky left-0 bg-primary/10 z-10 border-r">Total</TableCell>
                    {teamMemberColumns.map(member => (
                      <TableCell key={member.id} className="text-center font-bold">
                        {formatHours(teamColumnTotals[member.id])} hrs
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-primary/20">
                      {formatHours(teamColumnTotals.total)} hrs
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </TabsContent>

          {/* Time View Tab Content */}
          <TabsContent value="time" className="mt-0">
            <div className="overflow-x-auto">
              <Table className="border-collapse">
                <TableHeader>
                  {/* Time Periods group header */}
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[200px] min-w-[150px] sticky left-0 bg-muted/30 z-10 border-r"></TableHead>
                    <TableHead
                      colSpan={timeColumns.length}
                      className="text-center font-bold"
                    >
                      Last 7 Days
                    </TableHead>
                    <TableHead className="text-center font-bold bg-muted/30 min-w-[100px]">Total</TableHead>
                  </TableRow>

                  {/* Column headers */}
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px] min-w-[150px] sticky left-0 bg-muted/50 z-10 border-r">Project</TableHead>
                    {timeColumns.map(date => (
                      <TableHead key={date.id} className="text-center min-w-[100px]">
                        {date.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold bg-muted/30 min-w-[100px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTimeData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={timeColumns.length + 2} className="text-center py-8 text-gray-500">
                        No project time data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectTimeData.map((project, index) => (
                      <TableRow key={project.id} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                        <TableCell
                          className={`font-medium sticky left-0 z-10 border-r ${
                            index % 2 === 0 ? 'bg-muted/10' : 'bg-white'
                          }`}
                        >
                          {project.name}
                        </TableCell>
                        {timeColumns.map(date => (
                          <TableCell key={date.id} className="text-center">
                            {project.dates[date.id] ? (
                              <span className="font-medium">{formatHours(project.dates[date.id])} hrs</span>
                            ) : (
                              <span className="text-gray-400">0.0 hrs</span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold bg-muted/10">
                          {formatHours(project.total)} hrs
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold sticky left-0 bg-primary/10 z-10 border-r">Total</TableCell>
                    {timeColumns.map(date => (
                      <TableCell key={date.id} className="text-center font-bold">
                        {formatHours(timeColumnTotals[date.id])} hrs
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-primary/20">
                      {formatHours(timeColumnTotals.total)} hrs
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeTracker;
