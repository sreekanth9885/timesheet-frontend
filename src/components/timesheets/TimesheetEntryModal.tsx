// src/components/timesheets/TimesheetEntryModal.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";

import type { TimesheetEntry, CreateTimesheetDto } from "../../types/timesheet";
import {
  useCreateTimesheetMutation,
  useGetTasksQuery,
  useUpdateTimesheetMutation,
} from "../../services/timesheetApi";
import { useGetProjectsQuery } from "../../services/projectsApi";

interface TimesheetEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: TimesheetEntry | null;
}

const getTodayISO = () => new Date().toISOString().split("T")[0];

const TimesheetEntryModal = ({
  isOpen,
  onClose,
  entry,
}: TimesheetEntryModalProps) => {
  const isEdit = !!entry;

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();

  const [createTimesheet, { isLoading: isCreating }] =
    useCreateTimesheetMutation();
  const [updateTimesheet, { isLoading: isUpdating }] =
    useUpdateTimesheetMutation();

  const [form, setForm] = useState<CreateTimesheetDto>({
    date: getTodayISO(),
    project_id: 0,
    task_id: null,
    start_time: "09:00",
    end_time: "18:00",
    break_minutes: 30,
    description: "",
    work_summary: "",
  });

  // Reset form whenever modal opens with new entry
  useEffect(() => {
    if (!isOpen) return;
    if (entry) {
      setForm({
        date: entry.date.split("T")[0],
        project_id: entry.project_id,
        task_id: entry.task_id ?? null,
        start_time: entry.start_time || "09:00",
        end_time: entry.end_time || "18:00",
        break_minutes: entry.break_minutes ?? 30,
        description: entry.description || "",
        work_summary: entry.work_summary || entry.description || "",
      });
    } else {
      setForm({
        date: getTodayISO(),
        project_id: 0,
        task_id: null,
        start_time: "09:00",
        end_time: "18:00",
        break_minutes: 30,
        description: "",
        work_summary: "",
      });
    }
  }, [isOpen, entry]);

  const update = <K extends keyof CreateTimesheetDto>(
    key: K,
    value: CreateTimesheetDto[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (
      !form.project_id ||
      !form.start_time ||
      !form.end_time ||
      !form.description.trim()
    ) {
      toast.error("Please fill in all required time entry fields");
      return;
    }

    const payload: CreateTimesheetDto = {
      ...form,
      task_id: form.task_id || null,
      description: form.description.trim(),
      work_summary: form.work_summary.trim() || form.description.trim(),
    };

    try {
      if (isEdit && entry) {
        await updateTimesheet({ id: entry.id, data: payload }).unwrap();
        toast.success("Time entry updated!");
      } else {
        await createTimesheet(payload).unwrap();
        toast.success("Time entry logged successfully!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save timesheet");
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Timesheet Entry" : "Log Daily Hours"}
      width="max-w-2xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isCreating || isUpdating
              ? "Saving..."
              : isEdit
                ? "Update Entry"
                : "Log Time Entry"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className={labelClass}>
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            disabled={isEdit}
            className={inputClass}
          />
        </div>

        {/* Project + Task */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Project <span className="text-red-500">*</span>
            </label>
            <select
              value={form.project_id}
              onChange={(e) =>
                update("project_id", parseInt(e.target.value) || 0)
              }
              disabled={isEdit}
              className={inputClass}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.project_code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Task (Optional)</label>
            <select
              value={form.task_id ?? ""}
              onChange={(e) =>
                update(
                  "task_id",
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              className={inputClass}
            >
              <option value="">Select Task</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time window */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => update("start_time", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => update("end_time", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Break (Mins)</label>
            <input
              type="number"
              value={form.break_minutes}
              onChange={(e) =>
                update("break_minutes", parseInt(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>
            Work Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Summary of accomplishments and deliverables completed today..."
            className={inputClass}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TimesheetEntryModal;
