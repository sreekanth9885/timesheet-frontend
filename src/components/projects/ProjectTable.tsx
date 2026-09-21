import type { Project } from "../../types/projectTypes";
import { getPriorityBadge, getStatusBadge } from "../../utils/projectHelpers";
import { Pagination } from "../tasks/Pagination";

interface Props {
  projects: Project[];
  page: number;
  pageSize: number;
  total: number;
  isAdmin: boolean;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (p: Project) => void;
  onManageTeam: (p: Project) => void;
  onDelete: (p: Project) => void;
}

export function ProjectTable({
  projects,
  page,
  pageSize,
  total,
  isAdmin,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onManageTeam,
  onDelete,
}: Props) {
  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No projects found.</div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = projects.slice(start, start + pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Project Name</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Priority</th>
              <th className="text-left px-4 py-3 font-medium">Budget</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                  {p.project_code}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    {p.client_name || "Internal"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getStatusBadge(
                      p.status,
                    )}`}
                  >
                    {(p.status || "active").toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getPriorityBadge(
                      p.priority,
                    )}`}
                  >
                    {(p.priority || "medium").toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.budget_hours ?? 0} hrs
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onManageTeam(p)}
                          className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
                        >
                          Team
                        </button>
                        <button
                          onClick={() => onEdit(p)}
                          title="Edit Project"
                          className="p-1.5 rounded border border-gray-200 hover:bg-gray-100"
                        >
                          <svg
                            width={15}
                            height={15}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          title="Delete Project"
                          className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <svg
                            width={15}
                            height={15}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
