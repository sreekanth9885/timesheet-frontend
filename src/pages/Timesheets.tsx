// src/pages/Timesheets.tsx
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import Table, { type Column } from "../components/Table";
import StatusBadge from "../components/timesheets/StatusBadge";
import TimesheetStats from "../components/timesheets/TimesheetStats";
import WeeklySummary from "../components/timesheets/WeeklySummary";
import TimesheetEntryModal from "../components/timesheets/TimesheetEntryModal";

import type { TimesheetEntry } from "../types/timesheet";
import {
  useDeleteTimesheetMutation,
  useGetMyTodayTimesheetsQuery,
  useGetMyWeekTimesheetsQuery,
  useSubmitTimesheetMutation,
} from "../services/timesheetApi";

const Timesheets = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);

  // RTK Query - auto-refetches when mutations invalidate 'Timesheets' tag
  const { data: todayEntries = [], isLoading } = useGetMyTodayTimesheetsQuery();
  const { data: weekEntries = [] } = useGetMyWeekTimesheetsQuery();

  const [deleteTimesheet] = useDeleteTimesheetMutation();
  const [submitTimesheet] = useSubmitTimesheetMutation();

  const totalHours = useMemo(
    () => todayEntries.reduce((a, b) => a + Number(b.total_hours || 0), 0),
    [todayEntries],
  );

  const draftEntries = useMemo(
    () => todayEntries.filter((e) => e.status === "draft"),
    [todayEntries],
  );

  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // ---- Handlers ----
  const handleAdd = () => {
    setEditingEntry(null);
    setModalOpen(true);
  };

  const handleEdit = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this draft time entry?")) return;
    try {
      await deleteTimesheet(id).unwrap();
      toast.success("Draft entry removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Deletion failed");
    }
  };

  const handleSubmitForApproval = async () => {
    if (!draftEntries.length) return;
    try {
      await Promise.all(
        draftEntries.map((entry) => submitTimesheet(entry.id).unwrap()),
      );
      toast.success("Timesheet submitted for manager approval!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit timesheets");
    }
  };

  // ---- Table Columns ----
  const columns: Column<TimesheetEntry>[] = [
    {
      key: "project_id",
      label: "Project / Task",
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-800">
            Project #{row.project_id}
          </div>
          <div className="text-xs text-gray-500">
            {row.task_id ? `Task #${row.task_id}` : "General Development"}
          </div>
        </div>
      ),
    },
    {
      key: "start_time",
      label: "Time Window",
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-800">
            {row.start_time || "-"} - {row.end_time || "-"}
          </div>
          <div className="text-xs text-gray-500">
            Break: {row.break_minutes || 0} mins
          </div>
        </div>
      ),
    },
    {
      key: "total_hours",
      label: "Total Hours",
      render: (val) => (
        <span className="font-semibold text-[15px]">
          {Number(val).toFixed(1)}h
        </span>
      ),
    },
    {
      key: "description",
      label: "Work Summary",
      render: (val) => (
        <div className="max-w-[200px] text-xs text-gray-500 truncate">
          {val || "-"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.status === "approved" ? (
          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row)}
              title="Edit Entry"
              className="p-1.5 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            {row.status === "draft" && (
              <button
                onClick={() => handleDelete(row.id)}
                title="Delete Draft"
                className="p-1.5 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Timesheets & Time Tracking
          </h1>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            Today, {todayStr}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmitForApproval}
            disabled={!draftEntries.length}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit for Approval
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Log Time
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        <div className="space-y-6">
          <TimesheetStats totalHours={totalHours} target={8} />
          <Table
            columns={columns}
            data={todayEntries}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            total={todayEntries.length}
            onPageChange={(p, size) => {
              setPage(p);
              if (size) setPageSize(size);
            }}
          />
        </div>
        <div>
          <WeeklySummary todayEntries={weekEntries} />
        </div>
      </div>

      {/* Modal */}
      <TimesheetEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={editingEntry}
      />
    </div>
  );
};

export default Timesheets;
