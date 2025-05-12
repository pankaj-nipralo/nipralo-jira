export default function TasksTable({ tasks }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-7">
      <h3 className="font-semibold mb-4">Recent Tasks</h3>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-[12px] lg:text-sm ">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="py-1 px-2">ID</th>
              <th className="py-1 px-2">Title</th>
              <th className="py-1 px-2">Status</th>
              <th className="py-1 px-2">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={i} className="border-t">
                <td className="py-1 px-2">{task.id}</td>
                <td className="py-1 px-2">{task.title}</td>
                <td className="py-1 px-2">{task.status}</td>
                <td className="py-1 px-2">{task.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
