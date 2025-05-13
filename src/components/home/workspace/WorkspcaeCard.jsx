"use client";
import { useRouter } from "next/navigation";

const WorkspaceCard = ({ title, description, workItems, slug }) => {
  const router = useRouter();
  
  return (
    <div
      className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/nipralo-jira/workspace/${slug}`)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {workItems.open} {workItems.open === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>1 board</span>
          <span className="ml-1">▾</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;