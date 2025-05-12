"use client"

import { exportToCsv } from "@/utils/exportToCsv";

export default function ReportHeader({ taskData }) {
  const handleExport = () => {
    exportToCsv("jira-report.csv", taskData);
  };

  return (
    <div className="flex flex-col p-4 gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <select className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
        <button
          onClick={handleExport}
          className="bg-black text-white rounded-md px-4 py-2 text-sm w-full sm:w-auto"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
