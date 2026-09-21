import type { Employee } from "../../types/employeeTypes";
import { getInitials, getStatusBadge } from "../../utils/employeeHelpers";
import { Pagination } from "../tasks/Pagination";

interface Props {
  employees: Employee[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (emp: Employee) => void;
  onTerminate: (emp: Employee) => void;
}

export function EmployeeTable({
  employees,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onTerminate,
}: Props) {
  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No employees found.</div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = employees.slice(start, start + pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Emp ID</th>
              <th className="text-left px-4 py-3 font-medium">Employee Name</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">
                Designation / Role
              </th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                  {emp.employee_id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                      {getInitials(emp.first_name, emp.last_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {emp.first_name} {emp.last_name ?? ""}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {emp.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {emp.department_name ?? (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-800">{emp.designation || "—"}</div>
                  {emp.role_name && (
                    <div className="text-[11px] text-gray-500">
                      {emp.role_name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getStatusBadge(
                      emp.status,
                    )}`}
                  >
                    {(emp.status || "active").toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(emp)}
                      title="Edit Employee"
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

                    {emp.status !== "terminated" && (
                      <button
                        onClick={() => onTerminate(emp)}
                        title="Terminate Employee"
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
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </>
  );
}
