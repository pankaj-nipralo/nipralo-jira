"use client";

import { Activity, Bug, Clock, Users, CheckCircle2, ListChecks } from "lucide-react";
import CountCard from "./CountCard";

const data = [
  { title: "Issues Created", number: 124, icon: Activity },
  { title: "Issues Resolved", number: 97, icon: CheckCircle2 },
  { title: "In Progress", number: 32, icon: ListChecks },
  { title: "Time Spent (hrs)", number: 86, icon: Clock },
  { title: "Active Users", number: 14, icon: Users },
  { title: "Open Bugs", number: 19, icon: Bug },
];

const SummaryCounts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/*  */}
        {
            data.map((card, index) => (
                <CountCard key={index} card={card} />
            ))
        }
    </div>
  )
}

export default SummaryCounts
