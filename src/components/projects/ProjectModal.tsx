import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type {
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectStatus,
} from "../../types/projectTypes";
import { generateProjectCode } from "../../utils/projectHelpers";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../services/projectsApi";

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

const emptyForm = (): ProjectFormData => ({
  project_code: generateProjectCode(),
  name: "",
  client_name: "",
  status: "active",
  priority: "medium",
  budget_hours: 100,
  estimated_hours: 100,
  start_date: null,
  end_date: null,
  description: "",
});

const fromProject = (p: Project): ProjectFormData => ({
  project_code: p.project_code,
  name: p.name,
  client_name: p.client_name ?? "",
  status: p.status ?? "active",
  priority: p.priority ?? "medium",
  budget_hours: p.budget_hours ?? 100,
  estimated_hours: p.estimated_hours ?? p.budget_hours ?? 100,
  start_date: p.start_date ? p.start_date.split("T")[0] : null,
  end_date: p.end_date ? p.end_date.split("T")[0] : null,
  description: p.description ?? "",
});

export function ProjectModal({ open, project, onClose }: Props) {
  const isEdit = !!project;
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();

  useEffect(() => {
    if (!open) return;
    setForm(project ? fromProject(project) : emptyForm());
  }, [open, project]);

  if (!open) return null;

  const set = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter project name");
      return;
    }
    try {
      if (isEdit && project) {
        // project_code is disabled on edit — omit it from the payload
        const { project_code: _ignored, ...body } = form;
        await updateProject({
          id: project.id,
          body: body as ProjectFormData,
        }).unwrap();
        toast.success("Project updated successfully!");
      } else {
        await createProject(form).unwrap();
        toast.success("Project created successfully!");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Project Details" : "Create New Project"}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.project_code ?? ""}
                onChange={(e) => set("project_code", e.target.value)}
                disabled={isEdit}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                required={!isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. ERP Cloud Migration"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => set("client_name", e.target.value)}
                placeholder="Internal or Client name"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ProjectStatus)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft / Planning</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  set("priority", e.target.value as ProjectPriority)
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
                Budget Hours
              </label>
              <input
                type="number"
                value={form.budget_hours}
                onChange={(e) =>
                  set("budget_hours", Number(e.target.value) || 0)
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date ?? ""}
                onChange={(e) => set("start_date", e.target.value || null)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={form.end_date ?? ""}
                onChange={(e) => set("end_date", e.target.value || null)}
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
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Project deliverables and scope..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
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
              {isEdit ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
