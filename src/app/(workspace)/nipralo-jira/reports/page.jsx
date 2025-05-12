import ReportHeader from "@/components/report/ReportHeader";
import ChartSection from "@/components/report/ChartSection";
import SummaryCards from "@/components/report/SummaryCards";
import TasksTable from "@/components/report/TasksTable";

const tasks = [
  { id: "T-100", title: "Bug fix", status: "In Progress", assignee: "Shahbaz" },
  { id: "T-101", title: "Jira UI", status: "To Do", assignee: "Pankaj" },
  { id: "T-101", title: "Jira UI", status: "To Do", assignee: "Pankaj" },
  { id: "T-101", title: "Jira UI", status: "Done", assignee: "Pankaj" },
  { id: "T-102", title: "Nipralo", status: "To Do", assignee: "Shoaib" },
];

const chartData = [
  {
    name: "To Do",
    value: tasks.filter((task) => task.status === "To Do").length,
  },
  {
    name: "In Progress",
    value: tasks.filter((task) => task.status === "In Progress").length,
  },
  {
    name: "Done",
    value: tasks.filter((task) => task.status === "Done").length,
  },
];

const summary = {
  total: chartData.reduce((acc, rec) => acc + rec.value, 0),
  completed: chartData.find((item) => item.name === "Done")?.value ?? 0,
  inProgress: chartData.find((item) => item.name === "In Progress")?.value ?? 0,
  overdue: chartData.find((item) => item.name === "To Do")?.value ?? 0,
};

export const reportData = {
  chartData,
  summary,
  tasks,
};

export default function ReportsPage() {
  return (
    <div className="w-full  mx-auto px-4 sm:px-6">
      <ReportHeader taskData={reportData.tasks} />
      <ChartSection data={reportData.chartData} />
      <SummaryCards summary={reportData.summary} />
      <TasksTable tasks={reportData.tasks} />
    </div>
  );
}
