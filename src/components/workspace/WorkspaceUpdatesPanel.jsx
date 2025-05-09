"use client";
import { useState } from "react";

const TABS = ["Worked on", "Assigned to me", "Starred"];

export default function WorkedOnList({ items }) {
  const [activeTab, setActiveTab] = useState("Worked on");

  // Filtered content based on tab
  const filteredItems = items.filter((group) =>
    group.tab === activeTab
  );

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex space-x-4 border-b text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              tab === activeTab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grouped Tasks */}
      {filteredItems.map((group) => (
        <div key={group.title} className="mt-4">
          <h4 className="text-xs text-gray-500 uppercase mb-2">{group.title}</h4>
          <div className="space-y-3">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between bg-white p-3 rounded-md shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {task.code} · {task.project}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{task.status}</span>
                  <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center text-sm font-bold">
                    {task.userInitials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="text-sm text-gray-400 mt-6">No activity in this tab.</div>
      )}
    </div>
  );
}
