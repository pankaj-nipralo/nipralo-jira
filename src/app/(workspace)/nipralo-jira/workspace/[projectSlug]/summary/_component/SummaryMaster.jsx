"use client";

import React from "react";
import SummaryNav from "./SummaryNav";
import SummaryCounts from "./SummaryCounts";
import SummaryStatus from "./SummaryStatus";
import SummaryTeams from "./SummaryTeam";
import {
  Activity,
  Bug,
  Clock,
  Users,
  CheckCircle2,
  ListChecks,
} from "lucide-react";

const data = [
  { title: "Issues Created", number: 124, icon: Activity },
  { title: "Issues Resolved", number: 97, icon: CheckCircle2 },
  { title: "In Progress", number: 32, icon: ListChecks },
  { title: "Time Spent (hrs)", number: 86, icon: Clock },
  { title: "Active Users", number: 12, icon: Users },
  { title: "Open Bugs", number: 19, icon: Bug },
];

const statusCounts = {
  toDo: 7,
  inProgress: 2,
  done: 0,
  total: 9,
};

const recentActivities = [
  {
    id: 1,
    user: "Pankaj Gupta",
    avatar:
      "https://res.cloudinary.com/djinjroiz/image/upload/v1746878261/free-user-icon-3296-thumb_erjsvh.png",
    ticketId: "NGP-9",
    task: "Create the home page",
    status: "TO DO",
  },
  {
    id: 2,
    user: "Uzair Sayyed",
    avatar:
      "https://res.cloudinary.com/djinjroiz/image/upload/v1746878261/free-user-icon-3296-thumb_erjsvh.png",
    ticketId: "NGP-10",
    task: "Create the about us page",
    status: "TO DO",
  },
];

const priorities = [
  { label: "Highest", color: "bg-red-500", value: 33 },
  { label: "Medium", color: "bg-orange-400", value: 50 },
  { label: "Low", color: "bg-green-500", value: 120 },
];

const workTypes = [
  { label: "Task", color: "bg-blue-500", percent: 76 },
  { label: "Epic", color: "bg-purple-500", percent: 22 },
];

const SummaryMaster = () => {
  return (
    <section className="flex flex-col gap-6 px-5 lg:px-10 xl:px-15">
      <SummaryNav />
      <SummaryCounts data={data} />
      <SummaryStatus
        statusCounts={statusCounts}
        recentActivities={recentActivities}
        priorities={priorities}
        workTypes={workTypes}
      />
      <SummaryTeams priorities={priorities} workTypes={workTypes} />
    </section>
  );
};

export default SummaryMaster;
