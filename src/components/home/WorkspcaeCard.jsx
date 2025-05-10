import { useRouter } from "next/navigation";

export default function WorkspaceCard({ title, description, workItems, slug}) {
  const router = useRouter();
  return (
    <div
      className="w-full sm:w-64 bg-white shadow rounded-lg border p-4 cursor-pointer hover:shadow-md transition-transform duration-400"
      onClick={() => router.push(`/nipralo-jira/workspace/${slug}`)}
    >
      <h3 className="text-sm font-semibold truncate">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <div className="mt-4 space-y-1 text-sm ">
        <p>
          Projects{" "}
          <span className="bg-gray-200 px-2 py-0.5 text-xs rounded-full">
            {workItems.open}
          </span>
        </p>
      </div>
      <div className="mt-4 text-xs text-gray-400">1 board ▾</div>
    </div>
  );
}
