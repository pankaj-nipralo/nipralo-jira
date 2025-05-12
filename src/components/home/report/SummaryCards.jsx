export default function SummaryCards({ summary }) {
  const cards = [
    { title: "Total Project", value: summary.total },
    { title: "Completed", value: summary.completed },
    { title: "In Progress", value: summary.inProgress },
    { title: "Total Hours", value: summary.totalHours },
    //   { title: "To Do", value: summary.overdue },
  ]
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-7">
      {cards.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow-md">
          <div className="text-sm text-gray-600">{item.title}</div>
          <div className="text-2xl font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
