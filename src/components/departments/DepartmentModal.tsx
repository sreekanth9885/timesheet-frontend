import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../../services/departmentsApi";
import type {
  Department,
  DepartmentFormData,
  DepartmentStatus,
} from "../../types/departmentTypes";

interface Props {
  open: boolean;
  department: Department | null;
  onClose: () => void;
}

const EMPTY_FORM: DepartmentFormData = {
  name: "",
  description: "",
  status: "active",
};

const fromDepartment = (d: Department): DepartmentFormData => ({
  name: d.name,
  description: d.description ?? "",
  status: d.status ?? "active",
});

export function DepartmentModal({ open, department, onClose }: Props) {
  const isEdit = !!department;
  const [form, setForm] = useState<DepartmentFormData>(EMPTY_FORM);
  const [createDepartment, { isLoading: creating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: updating }] =
    useUpdateDepartmentMutation();

  useEffect(() => {
    if (!open) return;
    setForm(department ? fromDepartment(department) : EMPTY_FORM);
  }, [open, department]);

  if (!open) return null;

  const set = <K extends keyof DepartmentFormData>(
    key: K,
    value: DepartmentFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter department name");
      return;
    }
    try {
      if (isEdit && department) {
        await updateDepartment({ id: department.id, body: form }).unwrap();
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(form).unwrap();
        toast.success("Department created successfully!");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Department" : "Add New Department"}
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
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Quality Assurance"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Department responsibilities..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as DepartmentStatus)
              }
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {isEdit ? "Update Department" : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
