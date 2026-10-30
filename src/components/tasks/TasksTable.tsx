import type { Task } from "../../types/taskTypes";
import {
  formatDueDate,
  getAssigneeName,
  getPriorityBadge,
} from "../../utils/taskHelpers";
import { Pagination } from "./Pagination";
import { TaskStatusSelect } from "./TaskStatusSelect";

interface Props {
  tasks: Task[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TasksTable({
  tasks,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: Props) {
  const start = (page - 1) * pageSize;
  const pageTasks = tasks.slice(start, start + pageSize);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No tasks found.</div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Task Name</th>
              <th className="text-left px-4 py-3 font-medium">Project</th>
              <th className="text-left px-4 py-3 font-medium">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium">Priority</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Due Date</th>
              <th className="text-left px-4 py-3 font-medium">Est. Hours</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 max-w-[280px]">
                  <div className="font-semibold text-gray-800 flex items-center gap-2">
                    <span>{task.name}</span>

                    {Number(task.is_employee_created) === 1 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        Self-Created
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {task.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700">
                    {task.project_name ?? "Project"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {getAssigneeName(task)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityBadge(
                      task.priority,
                    )}`}
                  >
                    {(task.priority ?? "medium").toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <TaskStatusSelect
                    taskId={task.id}
                    value={task.status ?? "pending"}
                  />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDueDate(task.due_date)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {task.estimated_hours ?? 0} hrs
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      title="Edit Task"
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
                      onClick={() => onDelete(task)}
                      title="Delete Task"
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
