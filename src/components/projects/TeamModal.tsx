import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { Project } from "../../types/projectTypes";
import {
  useAllocateEmployeeMutation,
  useDeallocateEmployeeMutation,
  useGetProjectEmployeesQuery,
} from "../../services/projectsApi";
import { useGetEmployeesQuery } from "../../services/tasksApi";

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export function TeamModal({ open, project, onClose }: Props) {
  const [employeeId, setEmployeeId] = useState("");
  const [allocation, setAllocation] = useState(100);

  const projectId = project?.id ?? 0;

  const { data: allocated = [], isLoading } = useGetProjectEmployeesQuery(
    projectId,
    { skip: !open || !projectId },
  );
  const { data: allEmployees = [] } = useGetEmployeesQuery(undefined, {
    skip: !open,
  });

  const [allocate, { isLoading: allocating }] = useAllocateEmployeeMutation();
  const [deallocate] = useDeallocateEmployeeMutation();

  useEffect(() => {
    if (open) {
      setEmployeeId("");
      setAllocation(100);
    }
  }, [open]);

  if (!open || !project) return null;

  const available = allEmployees.filter(
    (e) => !allocated.some((a) => a.id === e.id),
  );

  const handleAllocate = async () => {
    if (!employeeId) {
      toast.error("Select an employee to allocate");
      return;
    }
    try {
      await allocate({
        projectId: project.id,
        employee_id: Number(employeeId),
        allocation_percentage: allocation || 100,
      }).unwrap();
      toast.success("Employee allocated to project!");
      setEmployeeId("");
      setAllocation(100);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Allocation failed";
      toast.error(msg);
    }
  };

  const handleRemove = async (empId: number) => {
    try {
      await deallocate({ projectId: project.id, empId }).unwrap();
      toast.success("Employee removed from project");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Removal failed";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Project Team Allocation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="text-sm">
            <span className="text-gray-500">Project: </span>
            <strong className="text-gray-900">{project.name}</strong>{" "}
            <span className="text-gray-500">({project.project_code})</span>
          </div>

          <div className="flex gap-2">
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Employee to Allocate...</option>
              {available.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.first_name} {e.last_name ?? ""} ({e.employee_id})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={allocation}
              onChange={(e) => setAllocation(Number(e.target.value) || 0)}
              placeholder="100"
              className="w-[90px] border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={handleAllocate}
              disabled={allocating}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Allocate
            </button>
          </div>

          <div>
            {isLoading ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Loading team...
              </div>
            ) : allocated.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-6">
                No team members allocated yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">
                      Employee
                    </th>
                    <th className="text-left px-3 py-2 font-medium">
                      Allocation
                    </th>
                    <th className="text-left px-3 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allocated.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-800">
                          {a.first_name} {a.last_name ?? ""}
                        </div>
                        {a.email && (
                          <div className="text-xs text-gray-500">{a.email}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-700">
                          {a.allocation_percentage}%
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleRemove(a.id)}
                          className="px-2 py-1 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
