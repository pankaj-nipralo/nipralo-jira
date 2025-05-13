"use client";
import { useState } from "react";

const TABS = ["Worked on", "Assigned to me", "Starred"];

const statusColors = {
  Created: "bg-green-100 text-green-800",
  Updated: "bg-blue-100 text-blue-800",
  Viewed: "bg-gray-100 text-gray-800",
  Assigned: "bg-yellow-100 text-yellow-800",
  Pending: "bg-orange-100 text-orange-800",
  Starred: "bg-purple-100 text-purple-800",
};

const WorkspaceUpdatesPanel = ({ items }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const filteredItems = items.filter((group) => group.tab === activeTab);

  return (
    <div className="mt-12">
      <div className="flex space-x-4 border-b text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              tab === activeTab
                ? "border-gray-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredItems.map((group) => (
        <div key={group.title} className="mt-6">
          <h4 className="text-xs text-gray-500 uppercase font-medium mb-3">{group.title}</h4>
          <div className="space-y-3">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.code} · {task.project}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status] || 'bg-gray-100'}`}>
                    {task.status}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {task.userInitials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No activity found in this category</p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceUpdatesPanel;