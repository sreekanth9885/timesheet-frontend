import { useState } from "react";
import toast from "react-hot-toast";

import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import {
  useGetEmployeeDirectoryQuery,
  useTerminateEmployeeMutation,
} from "../services/employeesApi";
import type { Employee } from "../types/employeeTypes";
import { EmployeeFilters } from "../components/employees/EmployeeFilters";
import { EmployeeTable } from "../components/employees/EmployeeTable";
import { EmployeeModal } from "../components/employees/EmployeeModal";
import { useGetDepartmentsQuery } from "../services/departmentsApi";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const { filters, update } = useEmployeeFilters(() => setPage(1));

  // Server-side filtering (matches the original behaviour)
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useGetEmployeeDirectoryQuery({
    search: filters.search || undefined,
    department_id: filters.department_id || undefined,
    status: filters.status || undefined,
  });

  const { data: departments = [] } = useGetDepartmentsQuery();
  const [terminateEmployee] = useTerminateEmployeeMutation();

  const handleAdd = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const handleTerminate = async (emp: Employee) => {
    if (!confirm("Are you sure you want to terminate this employee?")) return;
    try {
      await terminateEmployee(emp.id).unwrap();
      toast.success("Employee terminated successfully");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to terminate employee";
      toast.error(msg);
    }
  };

  const changePageSize = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employees Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage company personnel, system roles, and department allocations.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <EmployeeFilters
          filters={filters}
          departments={departments}
          onChange={update}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading employees...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load employees from server.
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            page={page}
            pageSize={pageSize}
            total={employees.length}
            onPageChange={setPage}
            onPageSizeChange={changePageSize}
            onEdit={handleEdit}
            onTerminate={handleTerminate}
          />
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        employee={editingEmployee}
        departments={departments}
        onClose={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
      />
    </div>
  );
}
