import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type {
  Employee,
  Project,
  Task,
  TaskFormData,
  TaskPriority,
} from "../../types/taskTypes";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../services/tasksApi";

interface Props {
  open: boolean;
  task: Task | null;
  projects: Project[];
  employees: Employee[];
  onClose: () => void;
}

const EMPTY_FORM: TaskFormData = {
  name: "",
  project_id: 0,
  assigned_to: null,
  priority: "medium",
  estimated_hours: 8,
  due_date: null,
  description: "",
};

const fromTask = (task: Task): TaskFormData => ({
  name: task.name,
  project_id: task.project_id,
  assigned_to: task.assigned_to ?? null,
  priority: task.priority ?? "medium",
  estimated_hours: task.estimated_hours ?? 8,
  due_date: task.due_date ? task.due_date.split("T")[0] : null,
  description: task.description ?? "",
});

export function TaskModal({ open, task, projects, employees, onClose }: Props) {
  const isEdit = !!task;
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (!open) return;
    setForm(task ? fromTask(task) : EMPTY_FORM);
  }, [open, task]);

  if (!open) return null;

  const update = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.project_id) {
      toast.error("Please fill in task name and project");
      return;
    }
    try {
      if (isEdit && task) {
        await updateTask({ id: task.id, body: form }).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await createTask(form).unwrap();
        toast.success("Task created successfully!");
      }
      onClose();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Operation failed";
      toast.error(msg);
    }
  };

  const busy = creating || updating;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Task Details" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="e.g. Build API Endpoints"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={form.project_id || ""}
                onChange={(e) =>
                  update("project_id", Number(e.target.value) || 0)
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.project_code ? `(${p.project_code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned To
              </label>
              <select
                value={form.assigned_to ?? ""}
                onChange={(e) =>
                  update(
                    "assigned_to",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Assignee (Optional)</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name ?? ""} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  update("priority", e.target.value as TaskPriority)
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.estimated_hours ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    update("estimated_hours", "" as unknown as number);
                    return;
                  }

                  if (Number(value) >= 0) {
                    update("estimated_hours", Number(value));
                  }
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                placeholder="Enter estimated hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date ?? ""}
                onChange={(e) => update("due_date", e.target.value || null)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="Task requirements and acceptance criteria..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isEdit ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
