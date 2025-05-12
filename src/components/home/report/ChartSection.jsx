"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import { useState } from "react";

// Colors for the pie charts
const COLORS = ["#facc15", "#3b82f6", "#22c55e"];

export default function ChartSection({ data, tasks }) {
  const [range, setRange] = useState("month");

  const groupedData = groupTasksByRange(tasks, range);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mt-7">
      {/* Chart 1 - Task Distribution */}
      <div className="bg-white p-4 rounded-xl shadow-md w-full">
        <h2 className="font-semibold mb-4">Task Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 - Work Time */}
      <div className="bg-[#0F172A] p-4 rounded-xl shadow-md w-full">
        <div className="w-full  rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">
              Work Time ({range})
            </h2>
            <select
              className="bg-[#1E293B] text-white border border-gray-600 rounded-md px-3 py-1"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={groupedData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke="#CBD5E1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={{ stroke: "#475569" }}
              />
              <YAxis
                stroke="#CBD5E1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={{ stroke: "#475569" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  borderColor: "#334155",
                  color: "#F1F5F9",
                }}
                labelStyle={{ color: "#94A3B8" }}
                itemStyle={{ color: "#E0F2FE" }}
              />
              <Legend
                verticalAlign="bottom"
                align="right"
                iconType="circle"
                wrapperStyle={{ color: "#E0F2FE" }}
              />
              <Line
                type="monotone"
                dataKey="timeSpent"
                name="Total Hours"
                stroke="#FCD34D"
                strokeWidth={2.5}
                dot={{
                  r: 5,
                  stroke: "#FBBF24",
                  strokeWidth: 2,
                  fill: "#0F172A",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Grouping utility
function groupTasksByRange(tasks, range) {
  const formatMap = {
    day: "YYYY-MM-DD",
    week: "YYYY-[W]WW",
    month: "YYYY-MM",
    year: "YYYY",
  };

  const format = formatMap[range];

  const grouped = {};

  for (const task of tasks) {
    const dateKey = dayjs(task.completedAt).format(format);
    if (!grouped[dateKey]) {
      grouped[dateKey] = 0;
    }
    grouped[dateKey] += task.timeSpent;
  }

  return Object.entries(grouped).map(([label, timeSpent]) => ({
    label,
    timeSpent,
  }));
}
