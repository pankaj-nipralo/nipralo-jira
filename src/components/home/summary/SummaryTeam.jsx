"use client";

import React from "react";

const SummaryTeams = () => {
  const priorities = [
    { label: "Unassigned", color: "bg-gray-500", value: 19 },
    { label: "Pankaj", color: "bg-purple-400", value: 55 },
    { label: "Shoaib", color: "bg-green-500", value: 20 },
    { label: "Shahbaz", color: "bg-green-500", value: 10 },
  ];

  const totalTasks = priorities.reduce((acc, rec) => acc + rec.value, 0);

  const workTypes = [
    { label: "Task", color: "bg-blue-500", percent: 76 },
    { label: "Epic", color: "bg-purple-500", percent: 22 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Team WorkLoad */}
      <div className="bg-white py-5 px-6 sm:px-7 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">
              Team WorkLoad
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Get a breakdown of work Load by team members
            </p>
          </div>
          <a
            href="#"
            className="text-blue-600 text-sm sm:text-base font-medium mt-2 sm:mt-0"
          >
            View all team
          </a>
        </div>
        <div className="space-y-3">
          {priorities.map((item) => {
            const percent =
              totalTasks > 0 ? (item.value / totalTasks) * 100 : 0;
            return (
              <div key={item.label}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm sm:text-base">
                  {/* Label */}
                  <span className="sm:w-2/12 font-medium text-gray-700">
                    {item.label}
                  </span>

                  {/* Bar + Value */}
                  <div className="flex items-center gap-2 w-full sm:w-10/12">
                    <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                      <div
                        className={`${item.color} h-2 rounded transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="min-w-[28px] text-right">
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Types of Work */}
      <div className="bg-white py-5 px-6 sm:px-7 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">
              Epic Progress
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Get a breakdown of work items by type
            </p>
          </div>
          <a
            href="#"
            className="text-blue-600 text-sm sm:text-base font-medium mt-2 sm:mt-0"
          >
            View all items
          </a>
        </div>
        <div className="space-y-3">
          {workTypes.map((type) => (
            <div key={type.label}>
              <div className="flex justify-between items-center text-sm sm:text-base mb-1">
                <span>{type.label}</span>
                <span>{type.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  className={`${type.color} h-2 rounded`}
                  style={{ width: `${type.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryTeams;
