import type { Department } from "../../types/departmentTypes";
import type { EmployeeFilters as Filters } from "../../types/employeeTypes";

interface Props {
  filters: Filters;
  departments: Department[];
  onChange: (patch: Partial<Filters>) => void;
}

export function EmployeeFilters({ filters, departments, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
      <div className="relative w-[280px]">
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
          placeholder="Search employees by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[180px]"
        value={filters.department_id}
        onChange={(e) => onChange({ department_id: e.target.value })}
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[160px]"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="terminated">Terminated</option>
      </select>
    </div>
  );
}
