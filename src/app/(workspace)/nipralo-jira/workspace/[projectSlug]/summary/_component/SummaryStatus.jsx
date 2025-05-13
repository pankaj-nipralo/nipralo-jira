"use client";

import React from "react";

const SummaryStatus = ({
  statusCounts,
  recentActivities,
  priorities,
  workTypes,
}) => {
  // const statusCounts = {
  //   toDo: 7,
  //   inProgress: 2,
  //   done: 0,
  //   total: 9,
  // };

  // const recentActivities = [
  //   {
  //     id: 1,
  //     user: "Pankaj Gupta",
  //     avatar:
  //       "https://res.cloudinary.com/djinjroiz/image/upload/v1746878261/free-user-icon-3296-thumb_erjsvh.png",
  //     ticketId: "NGP-9",
  //     task: "Create the home page",
  //     status: "TO DO",
  //   },
  //   {
  //     id: 2,
  //     user: "Uzair Sayyed",
  //     avatar:
  //       "https://res.cloudinary.com/djinjroiz/image/upload/v1746878261/free-user-icon-3296-thumb_erjsvh.png",
  //     ticketId: "NGP-10",
  //     task: "Create the about us page",
  //     status: "TO DO",
  //   },
  // ];

  // const priorities = [
  //   { label: "Highest", color: "bg-red-500", value: 33 },
  //   { label: "Medium", color: "bg-orange-400", value: 50 },
  //   { label: "Low", color: "bg-green-500", value: 120 },
  // ];

  const totalTasks = priorities.reduce((acc, rec) => acc + rec.value, 0);

  // const workTypes = [
  //   { label: "Task", color: "bg-blue-500", percent: 76 },
  //   { label: "Epic", color: "bg-purple-500", percent: 22 },
  // ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left Column */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Status Overview */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Status Overview</h2>
              <p className="text-sm text-gray-500">
                Get a snapshot of the status of your work items
              </p>
            </div>
            <a href="#" className="text-blue-600 text-sm font-medium">
              View all work items
            </a>
          </div>
          <div className="flex justify-around mt-4 text-center">
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {statusCounts.toDo}
              </p>
              <p className="text-sm text-gray-500">To Do</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-blue-600">
                {statusCounts.inProgress}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-green-600">
                {statusCounts.done}
              </p>
              <p className="text-sm text-gray-500">Done</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-purple-600">
                {statusCounts.total}
              </p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-800 mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-500 mb-3">
            Stay up to date with what’s happening across the project
          </p>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-2 items-start">
                <img
                  src={activity.avatar}
                  alt={activity.user}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-black">
                      {activity.user}
                    </span>{" "}
                    created{" "}
                    <span className="text-blue-600 font-medium">
                      {activity.ticketId}
                    </span>{" "}
                    {activity.task}
                  </p>
                  <span className="text-xs text-gray-500">
                    Status: {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="text-blue-600 mt-100 text-sm font-medium">
            View all activity
          </a>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-4 w-full lg:w-[350px] xl:w-[450px]">
        {/* Priority Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-800">Priority Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">
            Get a holistic view of how work is being prioritized
          </p>
          <div className="space-y-2">
            {priorities.map((item) => {
              const percent =
                totalTasks > 0 ? (item.value / totalTasks) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className={`${item.color} h-2 rounded`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Types of Work */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold text-gray-800">Types of Work</h2>
              <p className="text-sm text-gray-500">
                Get a breakdown of work items by type
              </p>
            </div>
            <a href="#" className="text-blue-600 text-sm font-medium">
              View all items
            </a>
          </div>
          <div className="space-y-2">
            {workTypes.map((type) => (
              <div key={type.label}>
                <div className="flex justify-between text-sm">
                  <span>{type.label}</span>
                  <span>{type.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
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
    </div>
  );
};

export default SummaryStatus;
