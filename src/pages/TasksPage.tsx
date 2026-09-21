import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useTaskFilters } from "../hooks/useTaskFilters";

import {
  useDeleteTaskMutation,
  useGetEmployeesQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "../services/tasksApi";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TasksTable } from "../components/tasks/TasksTable";
import { TaskModal } from "../components/tasks/TaskModal";
import type { Task } from "../types/taskTypes";

export default function TasksPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { filters, update } = useTaskFilters(() => setPage(1));

  // Server-side filters (project / status / priority)
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useGetTasksQuery({
    project_id: filters.project_id || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
  });

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: employees = [] } = useGetEmployeesQuery();
  const [deleteTask] = useDeleteTaskMutation();

  // Client-side name search (matches original behavior)
  const filteredTasks = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.name?.toLowerCase().includes(q));
  }, [tasks, filters.search]);

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (task: Task) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id).unwrap();
      toast.success("Task deleted successfully");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete task";
      toast.error(msg);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasks &amp; Work Items
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign, schedule, and track progress across all project
            deliverables.
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
          Add Task
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TaskFilters filters={filters} projects={projects} onChange={update} />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading tasks...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to fetch tasks from server.
          </div>
        ) : (
          <TasksTable
            tasks={filteredTasks}
            page={page}
            pageSize={pageSize}
            total={filteredTasks.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        projects={projects}
        employees={employees}
        onClose={handleCloseModal}
      />
    </div>
  );
}
