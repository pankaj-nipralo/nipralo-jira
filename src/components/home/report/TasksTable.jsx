"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function TasksTable({ tasks }) {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(search.toLowerCase())
  );

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-7">
      <h3 className="font-semibold mb-4">Project</h3>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="w-full overflow-x-auto ">
        <table className="w-full text-[12px] lg:text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="py-1 px-2">Id</th>
              <th className="py-1 px-2">Name</th>
              <th className="py-1 px-2">Task</th>
              <th className="py-1 px-2">Completed</th>
              <th className="py-1 px-2">Time Spent</th>
              <th className="py-1 px-2">Team</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, i) => (
              <tr key={i} className="border-t">
                <td className="py-1 px-2">{task.id}</td>
                <td className="py-1 px-2">{task.name}</td>
                <td className="py-1 px-2">{task.task}</td>
                <td className="py-1 px-2">
                  <div key={i}>
                    <div className="flex justify-between text-sm px-2">
                      <span>
                        {Math.floor((task.completed / task.task) * 100)}%
                      </span>
                      <span>{task.completed}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="bg-green-500 h-3 rounded"
                        style={{
                          width: `${(task.completed / task.task) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-1 px-2">{task.timeSpent}</td>
                <td className="py-1 px-2">
                  <div className="flex items-center -space-x-2">
                    {task.team.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full text-white text-sm font-medium flex items-center justify-center border border-white"
                        title={member}
                        style={{ backgroundColor: stringToColor(member) }}
                      >
                        {member[0]}
                      </div>
                    ))}
                    {task.team.length > 3 && (
                      <button
                        onClick={() => {
                          setSelectedTeam(task.team);
                          setIsModalOpen(true);
                        }}
                        className="w-8 h-8 cursor-pointer rounded-full bg-gray-300 text-xs font-semibold text-gray-800 hover:bg-gray-400"
                      >
                        +{task.team.length - 3}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for team list */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm max-h-[300px] overflow-y-auto rounded bg-white p-4">
            <Dialog.Title className="font-semibold text-lg mb-2">
              Team Members
            </Dialog.Title>
            <ul className="space-y-2">
              {selectedTeam.map((member, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: stringToColor(member) }}
                  >
                    {member[0]}
                  </div>
                  <span className="text-sm font-medium">{member}</span>
                </li>
              ))}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
