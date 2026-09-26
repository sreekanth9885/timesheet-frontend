import type { AuditLogFilters as Filters } from "../../types/auditLogTypes";

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}

const ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
] as const;

export function AuditLogFilters({ filters, onChange }: Props) {
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
          placeholder="Search logs by action, table..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        value={filters.action}
        onChange={(e) => onChange({ action: e.target.value })}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[160px]"
      >
        <option value="">All Actions</option>
        {ACTIONS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
