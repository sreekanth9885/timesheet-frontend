import {
  formatDate,
  getPriorityBadge,
  getStatusBadge,
} from "../../utils/projectHelpers";
import type { Project } from "../../types/projectTypes";

interface Props {
  project: Project;
  isAdmin: boolean;
  onEdit: (p: Project) => void;
  onManageTeam: (p: Project) => void;
}

export function ProjectCard({ project, isAdmin, onEdit, onManageTeam }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col transition-transform hover:-translate-y-1">
      <div className="flex justify-between mb-4">
        <div className="min-w-0">
          <div className="text-xs text-gray-500 font-semibold font-mono">
            {project.project_code}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">
            {project.name}
          </h3>
          <div className="text-sm text-gray-500 truncate">
            Client: {project.client_name || "Internal"}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getStatusBadge(
              project.status,
            )}`}
          >
            {(project.status || "active").toUpperCase()}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getPriorityBadge(
              project.priority,
            )}`}
          >
            {(project.priority || "medium").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500 flex justify-between">
        <span>
          {formatDate(project.start_date)} → {formatDate(project.end_date)}
        </span>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700">
          Budget: {project.budget_hours ?? 0} hrs
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onManageTeam(project)}
              className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Team
            </button>
            <button
              onClick={() => onEdit(project)}
              className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
