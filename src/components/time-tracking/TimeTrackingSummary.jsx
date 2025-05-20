"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, FolderGit2, CheckSquare } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  ReferenceLine
} from 'recharts';

const TaskTrackingSummary = ({ timeEntries }) => {
  // Helper function to get time in minutes
  const getTimeInMinutes = (timeSpent) => {
    if (typeof timeSpent === 'object' && timeSpent.hours !== undefined) {
      return (timeSpent.hours * 60) + (timeSpent.minutes || 0);
    }
    if (typeof timeSpent === 'number') {
      return timeSpent * 60; // Convert decimal hours to minutes
    }
    return 0;
  };

  // Helper function to add time
  const addTime = (totalTime, timeToAdd) => {
    // Initialize if needed
    if (!totalTime || typeof totalTime !== 'object') {
      totalTime = { hours: 0, minutes: 0 };
    }

    // Get minutes from timeToAdd
    const minutesToAdd = getTimeInMinutes(timeToAdd);

    // Add to total
    const totalMinutes = (totalTime.hours * 60) + (totalTime.minutes || 0) + minutesToAdd;

    // Convert back to hours and minutes
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  };

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    // Total hours
    const totalHours = timeEntries.reduce(
      (total, entry) => addTime(total, entry.timeSpent),
      { hours: 0, minutes: 0 }
    );

    // Hours by team member
    const hoursByMember = timeEntries.reduce((acc, entry) => {
      const memberId = entry.teamMemberId;
      if (!acc[memberId]) {
        acc[memberId] = {
          id: memberId,
          name: entry.teamMemberName,
          hours: { hours: 0, minutes: 0 },
        };
      }
      acc[memberId].hours = addTime(acc[memberId].hours, entry.timeSpent);
      return acc;
    }, {});

    // Hours by epic
    const hoursByEpic = timeEntries.reduce((acc, entry) => {
      const epicId = entry.epicId;
      if (!acc[epicId]) {
        acc[epicId] = {
          id: epicId,
          name: entry.epicName,
          hours: { hours: 0, minutes: 0 },
        };
      }
      acc[epicId].hours = addTime(acc[epicId].hours, entry.timeSpent);
      return acc;
    }, {});

    // Hours by status
    const hoursByStatus = timeEntries.reduce((acc, entry) => {
      const status = entry.status;
      if (!acc[status]) {
        acc[status] = {
          status,
          hours: { hours: 0, minutes: 0 },
        };
      }
      acc[status].hours = addTime(acc[status].hours, entry.timeSpent);
      return acc;
    }, {});

    // Convert time objects to numeric values for charts
    const convertTimeToNumeric = (timeObj) => {
      if (typeof timeObj === 'object' && timeObj.hours !== undefined) {
        // Ensure we return a valid number
        const hours = Number(timeObj.hours) || 0;
        const minutes = Number(timeObj.minutes) || 0;
        return hours + (minutes / 60);
      }
      if (typeof timeObj === 'number') {
        return timeObj;
      }
      return 0;
    };

    // Process hoursByMember for chart display
    const processedHoursByMember = Object.values(hoursByMember).map(member => {
      // Ensure we have a valid numeric value for the chart
      const numericHours = Math.max(0.1, convertTimeToNumeric(member.hours));
      return {
        ...member,
        // Keep the original hours object for formatting
        originalHours: member.hours,
        // Add a numeric value for the chart
        hours: numericHours,
        // Add a numeric value for debugging
        numericHours: numericHours
      };
    });

    // Process hoursByEpic for chart display
    const processedHoursByEpic = Object.values(hoursByEpic).map(epic => {
      // Ensure we have a valid numeric value for the chart
      const numericHours = Math.max(0.1, convertTimeToNumeric(epic.hours));
      return {
        ...epic,
        // Keep the original hours object for formatting
        originalHours: epic.hours,
        // Add a numeric value for the chart
        hours: numericHours,
        // Add a numeric value for debugging
        numericHours: numericHours
      };
    });

    // Sort by numeric hours
    const sortedHoursByMember = [...processedHoursByMember].sort((a, b) => b.numericHours - a.numericHours);
    const sortedHoursByEpic = [...processedHoursByEpic].sort((a, b) => b.numericHours - a.numericHours);

    // Log for debugging
    // console.log('Processed Member Data:', sortedHoursByMember);
    // console.log('Processed Epic Data:', sortedHoursByEpic);

    return {
      totalHours,
      hoursByMember: sortedHoursByMember,
      hoursByEpic: sortedHoursByEpic,
      hoursByStatus: Object.values(hoursByStatus),
    };
  }, [timeEntries]);

  // Format time as "X h Y m" format
  const formatTime = (time) => {
    try {
      // Handle invalid inputs (null, undefined, NaN)
      if (time === null || time === undefined) {
        return '0 h 0 m';
      }

      // Check for originalHours property (used in chart data)
      if (typeof time === 'object' && time.originalHours !== undefined) {
        return formatTime(time.originalHours);
      }

      // Handle time object with hours and minutes properties
      if (typeof time === 'object' && time.hours !== undefined) {
        const h = time.hours || 0;
        const m = time.minutes || 0;
        return `${h} h ${m} m`;
      }

      // Handle numeric input (for backward compatibility and totals)
      if (typeof time === 'number' || !isNaN(Number(time))) {
        // If it's 0, return 0 h 0 m
        if (Number(time) === 0) {
          return '0 h 0 m';
        }

        // Convert decimal hours to hours and minutes
        const numHours = Number(time);
        const h = Math.floor(numHours);
        const m = Math.round((numHours - h) * 60);

        // Handle case where minutes round up to 60
        if (m === 60) {
          return `${h + 1} h 0 m`;
        }

        return `${h} h ${m} m`;
      }
    } catch (error) {
      console.error("Error formatting time:", error, time);
    }

    // Fallback for any other case
    return '0 h 0 m';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "submitted":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  // Debug output
  // console.log('Team Member Chart Data:', summaryData.hoursByMember);
  // console.log('Epic Chart Data:', summaryData.hoursByEpic);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Hours Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-primary" />
            Task Time Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatTime(summaryData.totalHours)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Hours tracked across all tasks
          </div>

          {/* Status breakdown */}
          <div className="mt-4 space-y-2">
            {summaryData.hoursByStatus.map((statusData) => (
              <div
                key={statusData.status}
                className="flex justify-between items-center"
              >
                <span
                  className={`capitalize ${getStatusColor(statusData.status)}`}
                >
                  {statusData.status}
                </span>
                <span className="font-medium">
                  {formatTime(statusData.hours)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hours by Team Member Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            Team Member Task Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.hoursByMember.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No data available
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summaryData.hoursByMember}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                  barCategoryGap={10}
                  barGap={5}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <ReferenceLine y={0} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    height={50}
                  />
                  <YAxis
                    label={{
                      value: 'Hours Tracked',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 12, textAnchor: 'middle' }
                    }}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value} hrs`}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    domain={[0, 'dataMax + 1']}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      // Use originalHours from the entry if available
                      if (props.payload && props.payload.originalHours) {
                        return [formatTime(props.payload.originalHours), 'Hours Tracked'];
                      }
                      return [formatTime(value), 'Hours Tracked'];
                    }}
                    labelFormatter={(label) => `Team Member: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    maxBarSize={60}
                    fill="#6366F1"
                    minPointSize={3}
                    isAnimationActive={true}
                  >
                    {/* Custom colors for each bar */}
                    {summaryData.hoursByMember.map((_, index) => {
                      const colors = [
                        '#6366F1', '#10B981', '#8B5CF6',
                        '#F59E0B', '#EC4899', '#3B82F6',
                        '#EF4444', '#14B8A6', '#F97316'
                      ];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                    <LabelList
                      dataKey="hours"
                      position="top"
                      formatter={(value, entry) => {
                        // Check if entry and originalHours exist
                        if (entry && entry.originalHours) {
                          return formatTime(entry.originalHours);
                        }
                        // Fallback to the value if originalHours is not available
                        return formatTime(value);
                      }}
                      style={{
                        fill: '#4B5563',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hours by Epic Card */}
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FolderGit2 className="h-5 w-5 mr-2 text-primary" />
            Epic Task Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.hoursByEpic.length === 0 ? (
            <div className="text-sm text-muted-foreground">No data available</div>
          ) : (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summaryData.hoursByEpic}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 100,
                    bottom: 10,
                  }}
                  barCategoryGap={10}
                  barGap={5}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <ReferenceLine x={0} stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `${value} hrs`}
                    domain={[0, 'dataMax + 1']}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={100}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      // Use originalHours from the entry if available
                      if (props.payload && props.payload.originalHours) {
                        return [formatTime(props.payload.originalHours), 'Hours Tracked'];
                      }
                      return [formatTime(value), 'Hours Tracked'];
                    }}
                    labelFormatter={(label) => `Epic: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    minPointSize={3}
                    isAnimationActive={true}
                    fill="#10B981"
                  >
                    {summaryData.hoursByEpic.map((_, index) => {
                      const colors = [
                        '#10B981', '#6366F1', '#8B5CF6',
                        '#F59E0B', '#EC4899', '#3B82F6',
                        '#EF4444', '#14B8A6', '#F97316'
                      ];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                    <LabelList
                      dataKey="hours"
                      position="right"
                      formatter={(value, entry) => {
                        // Check if entry and originalHours exist
                        if (entry && entry.originalHours) {
                          return formatTime(entry.originalHours);
                        }
                        // Fallback to the value if originalHours is not available
                        return formatTime(value);
                      }}
                      style={{
                        fill: '#4B5563',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskTrackingSummary;
