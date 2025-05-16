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
  Cell
} from 'recharts';

const TaskTrackingSummary = ({ timeEntries }) => {
  // Calculate summary statistics
  const summaryData = useMemo(() => {
    // Total hours
    const totalHours = timeEntries.reduce(
      (sum, entry) => sum + entry.timeSpent,
      0
    );

    // Hours by team member
    const hoursByMember = timeEntries.reduce((acc, entry) => {
      const memberId = entry.teamMemberId;
      if (!acc[memberId]) {
        acc[memberId] = {
          id: memberId,
          name: entry.teamMemberName,
          hours: 0,
        };
      }
      acc[memberId].hours += entry.timeSpent;
      return acc;
    }, {});

    // Hours by epic
    const hoursByEpic = timeEntries.reduce((acc, entry) => {
      const epicId = entry.epicId;
      if (!acc[epicId]) {
        acc[epicId] = {
          id: epicId,
          name: entry.epicName,
          hours: 0,
        };
      }
      acc[epicId].hours += entry.timeSpent;
      return acc;
    }, {});

    // Hours by status
    const hoursByStatus = timeEntries.reduce((acc, entry) => {
      const status = entry.status;
      if (!acc[status]) {
        acc[status] = {
          status,
          hours: 0,
        };
      }
      acc[status].hours += entry.timeSpent;
      return acc;
    }, {});

    return {
      totalHours,
      hoursByMember: Object.values(hoursByMember).sort(
        (a, b) => b.hours - a.hours
      ),
      hoursByEpic: Object.values(hoursByEpic).sort(
        (a, b) => b.hours - a.hours
      ),
      hoursByStatus: Object.values(hoursByStatus),
    };
  }, [timeEntries]);

  // Format hours with 1 decimal place
  const formatHours = (hours) => {
    return hours.toFixed(1);
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

  // No custom chart functions needed with Recharts

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
            {formatHours(summaryData.totalHours)}
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
                  {formatHours(statusData.hours)} hrs
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
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                  />
                  <Tooltip
                    formatter={(value) => [`${formatHours(value)} hrs`, 'Hours Tracked']}
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
                      formatter={(value) => formatHours(value)}
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
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `${value} hrs`}
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
                    formatter={(value) => [`${formatHours(value)} hrs`, 'Hours Tracked']}
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
                      formatter={(value) => formatHours(value)}
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
