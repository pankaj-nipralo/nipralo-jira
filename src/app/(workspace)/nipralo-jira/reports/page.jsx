import ReportHeader from "@/components/home/report/ReportHeader";
import ChartSection from "@/components/home/report/ChartSection";
import SummaryCards from "@/components/home/report/SummaryCards";
import TasksTable from "@/components/home/report/TasksTable";

const tasks = [
  {
    id: "RP-100",
    name: "Ruby Print",
    task: 30,
    completed: 20,
    timeSpent: 120,
    team: ["Pankaj", "Uzair", "Shoaib", "Shahbaz"],
    status: "In Progress",
    completedAt: "2025-01-15",
  },
  {
    id: "WP-100",
    name: "Warpp",
    task: 50,
    completed: 23,
    timeSpent: 140,
    team: ["Pankaj", "Uzair", "Shoaib"],
    status: "Done",
    completedAt: "2025-02-10",
  },
  {
    id: "BM-100",
    name: "Bansi Metha",
    task: 120,
    completed: 90,
    timeSpent: 200,
    team: ["Pankaj", "Shoaib", "Shahbaz"],
    status: "In Progress",
    completedAt: "2025-03-05",
  },
  {
    id: "NP-100",
    name: "Niralo",
    task: 40,
    completed: 10,
    timeSpent: 80,
    team: ["Pankaj", "Uzair", "Shoaib", "Shahbaz"],
    status: "To Do",
    completedAt: "2025-04-01",
  },
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
  totalHours: tasks.reduce((acc, rec) => acc + rec.timeSpent, 0),
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
      <ChartSection data={reportData.chartData} tasks = {reportData.tasks} />
      <SummaryCards summary={reportData.summary} />
      <TasksTable tasks={reportData.tasks} />
    </div>
  );
}
