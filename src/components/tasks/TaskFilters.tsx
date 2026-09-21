import type { Project, TaskFilters as Filters } from "../../types/taskTypes";

interface Props {
  filters: Filters;
  projects: Project[];
  onChange: (patch: Partial<Filters>) => void;
}

export function TaskFilters({ filters, projects, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
      <div className="relative w-[260px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search tasks by name..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[180px]"
        value={filters.project_id}
        onChange={(e) => onChange({ project_id: e.target.value })}
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[150px]"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="on_hold">On Hold</option>
      </select>

      <select
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[150px]"
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
}
