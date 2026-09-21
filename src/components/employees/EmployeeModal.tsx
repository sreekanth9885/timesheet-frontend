import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../services/employeesApi";
import type { Employee, EmployeeFormData } from "../../types/employeeTypes";
import {
  generateEmployeeId,
  toUpdatePayload,
} from "../../utils/employeeHelpers";
import type { Department } from "../../types/departmentTypes";

interface Props {
  open: boolean;
  employee: Employee | null;
  departments: Department[];
  onClose: () => void;
}

const emptyForm = (): EmployeeFormData => ({
  employee_id: generateEmployeeId(),
  email: "",
  password: "password123",
  first_name: "",
  last_name: "",
  mobile: "",
  department_id: null,
  designation: "",
  role_id: 3,
});

const fromEmployee = (emp: Employee): EmployeeFormData => ({
  employee_id: emp.employee_id,
  email: emp.email,
  password: "",
  first_name: emp.first_name,
  last_name: emp.last_name ?? "",
  mobile: emp.mobile ?? "",
  department_id: emp.department_id ?? null,
  designation: emp.designation ?? "",
  role_id: emp.role_id,
});

export function EmployeeModal({ open, employee, departments, onClose }: Props) {
  const isEdit = !!employee;
  const [form, setForm] = useState<EmployeeFormData>(emptyForm);
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (!open) return;
    setForm(employee ? fromEmployee(employee) : emptyForm());
  }, [open, employee]);

  if (!open) return null;

  const set = <K extends keyof EmployeeFormData>(
    key: K,
    value: EmployeeFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim()) {
      toast.error("Please enter first name");
      return;
    }

    if (!isEdit) {
      if (!form.employee_id?.trim() || !form.email?.trim() || !form.password) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    try {
      if (isEdit && employee) {
        await updateEmployee({
          id: employee.id,
          body: toUpdatePayload(form),
        }).unwrap();
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(form).unwrap();
        toast.success("Employee created successfully!");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Employee Record" : "Add New Employee"}
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
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.employee_id ?? ""}
                onChange={(e) => set("employee_id", e.target.value)}
                disabled={isEdit}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                required={!isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
                disabled={isEdit}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                required={!isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                value={form.department_id ?? ""}
                onChange={(e) =>
                  set(
                    "department_id",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                System Role <span className="text-red-500">*</span>
              </label>
              <select
                value={form.role_id}
                onChange={(e) => set("role_id", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                required
              >
                <option value={3}>
                  Employee (Can submit timesheets &amp; tasks)
                </option>
                <option value={2}>
                  Admin / HR (Can approve &amp; manage projects)
                </option>
                <option value={1}>Super Admin (Full system control)</option>
              </select>
            </div>
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
              {isEdit ? "Update Employee" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
