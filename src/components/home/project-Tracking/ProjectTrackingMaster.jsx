"use client";

import TimeTrackingFiltering from "@/components/home/project-Tracking/TimeTrackingFiltering";
import { useState } from "react";

const ProjectTrackingMaster = () => {

  const [filters, setFilters] = useState({
    dateRange: { type: 'all' },
    teamMembers: [],
    projects: [],
    statuses: []
  }); 



  return (
    <>
      <div className="flex justify-start items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Time Tracking</h1>
      </div>
      <TimeTrackingFiltering onFilterChange={setFilters}  />
    </>
  );
};

export default ProjectTrackingMaster;
