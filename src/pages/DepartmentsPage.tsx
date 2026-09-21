import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useDeleteDepartmentMutation,
  useGetDepartmentDirectoryQuery,
} from "../services/departmentsApi";
import type { Department } from "../types/departmentTypes";
import { DepartmentTable } from "../components/departments/DepartmentTable";
import { DepartmentModal } from "../components/departments/DepartmentModal";

export default function DepartmentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartmentDirectoryQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  // Client-side search (matches original behaviour)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q),
    );
  }, [departments, search]);

  // Reset to page 1 whenever the search changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setModalOpen(true);
  };

  const handleDelete = async (dept: Department) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(dept.id).unwrap();
      toast.success("Department deleted successfully");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Cannot delete department with active employees";
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
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize employees and projects into structured functional
            departments.
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
          Add Department
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative w-[320px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search departments by name or description..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading departments...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to fetch departments from server.
          </div>
        ) : (
          <DepartmentTable
            departments={filtered}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={changePageSize}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <DepartmentModal
        open={modalOpen}
        department={editingDepartment}
        onClose={() => {
          setModalOpen(false);
          setEditingDepartment(null);
        }}
      />
    </div>
  );
}
