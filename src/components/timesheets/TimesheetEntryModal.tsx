// src/components/timesheets/TimesheetEntryModal.tsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";

import type { TimesheetEntry, CreateTimesheetDto } from "../../types/timesheet";
import {
  useCreateTimesheetMutation,
  useGetMyWeekTimesheetsQuery,
  useGetTasksQuery,
  useUpdateTimesheetMutation,
} from "../../services/timesheetApi";
import { useGetProjectsQuery } from "../../services/projectsApi";

interface TimesheetEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: TimesheetEntry | null;
}

const getTodayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const minutesToTime = (mins: number) => {
  const safe = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
/** Given start + work hours + break, return end time HH:MM. */
const computeEndTime = (start: string, hours: number, breakMins: number) =>
  minutesToTime(timeToMinutes(start) + hours * 60 + breakMins);

/** Mon→Sun of the week containing `iso`. */
const getWeekDays = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const sel = new Date(y, m - 1, d);
  const dow = sel.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(y, m - 1, d + mondayOffset);
  const todayISO = getTodayISO();

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dISO = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    return {
      iso: dISO,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      isToday: dISO === todayISO,
      isFuture: dISO > todayISO,
    };
  });
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

/* ══════════════════════════════════════════════════════════
   ROOT MODAL  (tabs shell)
   ══════════════════════════════════════════════════════════ */
const TimesheetEntryModal = ({
  isOpen,
  onClose,
  entry,
}: TimesheetEntryModalProps) => {
  const isEdit = !!entry;
  const [tab, setTab] = useState<"daily" | "weekly">("daily");

  // Reset to daily tab each time the modal opens
  useEffect(() => {
    if (isOpen) setTab("daily");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? "Edit Timesheet Entry"
          : tab === "weekly"
            ? "Log Weekly Hours"
            : "Log Daily Hours"
      }
      width="max-w-3xl"
      footer={null}
    >
      {/* Tabs (hidden when editing an existing entry) */}
      {!isEdit && (
        <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setTab("daily")}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              tab === "daily"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Daily Hours
          </button>
          <button
            type="button"
            onClick={() => setTab("weekly")}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              tab === "weekly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Weekly Hours
          </button>
        </div>
      )}

      {isEdit || tab === "daily" ? (
        <DailyHoursForm entry={entry} onClose={onClose} />
      ) : (
        <WeeklyHoursForm onClose={onClose} />
      )}
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════
   DAILY FORM  (your existing form, minimally adjusted)
   ══════════════════════════════════════════════════════════ */
function DailyHoursForm({
  entry,
  onClose,
}: {
  entry?: TimesheetEntry | null;
  onClose: () => void;
}) {
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
  const [breakMinutesInput, setBreakMinutesInput] = useState("30");

  useEffect(() => {
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
      setBreakMinutesInput(String(entry.break_minutes ?? 30));
    }
  }, [entry]);

  const update = <K extends keyof CreateTimesheetDto>(
    key: K,
    value: CreateTimesheetDto[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const submit = async () => {
    const breakMinutes = Number(breakMinutesInput);
    if (breakMinutesInput === "" || !Number.isInteger(breakMinutes)) {
      return toast.error("Please enter valid break minutes");
    }
    if (
      !form.project_id ||
      !form.start_time ||
      !form.end_time ||
      !form.description.trim()
    ) {
      return toast.error("Please fill in all required fields");
    }

    const payload: CreateTimesheetDto = {
      ...form,
      break_minutes: breakMinutes,
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

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>
            Start <span className="text-red-500">*</span>
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
            End <span className="text-red-500">*</span>
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
            min="0"
            step="1"
            value={breakMinutesInput}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d+$/.test(v)) setBreakMinutesInput(v);
            }}
            onBlur={() => {
              const v = Math.max(0, Number(breakMinutesInput) || 0);
              setBreakMinutesInput(String(v));
              update("break_minutes", v);
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Work Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Summary of accomplishments today..."
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={isCreating || isUpdating}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isCreating || isUpdating
            ? "Saving..."
            : isEdit
              ? "Update Entry"
              : "Log Time Entry"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   WEEKLY FORM  (bulk add for any week: past / current)
   ══════════════════════════════════════════════════════════ */
function WeeklyHoursForm({ onClose }: { onClose: () => void }) {
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const [createTimesheet, { isLoading }] = useCreateTimesheetMutation();

  const [weekDate, setWeekDate] = useState(getTodayISO());
  const [projectId, setProjectId] = useState<number>(0);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [description, setDescription] = useState("");
  const [hoursMap, setHoursMap] = useState<Record<string, string>>({});

  const weekDays = useMemo(() => getWeekDays(weekDate), [weekDate]);

  // Fetch already-logged entries for the picked week (for context + skip logic)
  const { data: existing = [], isFetching } = useGetMyWeekTimesheetsQuery({
    date: weekDate,
  });

  const existingByDate = useMemo(() => {
    const m: Record<string, number> = {};
    existing.forEach((e) => {
      const iso = e.date.split("T")[0];
      m[iso] = (m[iso] || 0) + Number(e.total_hours || 0);
    });
    return m;
  }, [existing]);

  const totalNewHours = useMemo(
    () =>
      weekDays.reduce(
        (sum, d) =>
          sum + (existingByDate[d.iso] ? 0 : Number(hoursMap[d.iso] || 0)),
        0,
      ),
    [weekDays, hoursMap, existingByDate],
  );

  const submit = async () => {
    if (!projectId) return toast.error("Please select a project");

    const days = weekDays.filter((d) => {
      if (d.isFuture) return false;
      if (existingByDate[d.iso]) return false; // already has entries that day
      const h = Number(hoursMap[d.iso] || 0);
      return h > 0;
    });

    if (!days.length)
      return toast.error("Enter hours for at least one open day");

    for (const d of days) {
      const h = Number(hoursMap[d.iso]);
      if (!Number.isFinite(h) || h <= 0) {
        return toast.error(`${d.label}: hours must be greater than 0`);
      }
      if (h > 12) {
        return toast.error(`${d.label}: max 12h per day`);
      }
    }

    const results = await Promise.allSettled(
      days.map((d) => {
        const h = Number(hoursMap[d.iso]);
        const end_time = computeEndTime(startTime, h, breakMinutes);
        const desc = description.trim() || `Weekly log — ${d.label}`;
        return createTimesheet({
          date: d.iso,
          project_id: projectId,
          task_id: taskId,
          start_time: startTime,
          end_time,
          break_minutes: breakMinutes,
          description: desc,
          work_summary: desc,
        }).unwrap();
      }),
    );

    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );

    if (!failed.length) {
      toast.success(`Logged ${ok} day${ok !== 1 ? "s" : ""} successfully!`);
      onClose();
      return;
    }

    const sample =
      (failed[0].reason as any)?.data?.message || "Some days failed";
    toast.error(
      `${ok}/${results.length} saved. ${failed.length} failed: ${sample}`,
    );
  };

  return (
    <div className="space-y-4">
      {/* Week picker */}
      <div>
        <label className={labelClass}>Week containing</label>
        <input
          type="date"
          value={weekDate}
          onChange={(e) => {
            setWeekDate(e.target.value);
            setHoursMap({});
          }}
          className={inputClass}
        />
        <p className="text-[11px] text-gray-500 mt-1">
          Pick any date in the week — you can back-fill previous weeks.
        </p>
      </div>

      {/* Project + Task */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Project <span className="text-red-500">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(parseInt(e.target.value) || 0)}
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
            value={taskId ?? ""}
            onChange={(e) =>
              setTaskId(e.target.value ? parseInt(e.target.value) : null)
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

      {/* Defaults applied to every newly-logged day */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Time (all days)</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Break (Mins, all days)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={breakMinutes}
            onChange={(e) =>
              setBreakMinutes(Math.max(0, Number(e.target.value) || 0))
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Day-by-day grid */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_120px] bg-gray-50 px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          <span>Day</span>
          <span>Status</span>
          <span className="text-right">Hours to log</span>
        </div>
        {weekDays.map((d) => {
          const existingHours = existingByDate[d.iso] || 0;
          const locked = d.isFuture || existingHours > 0;
          return (
            <div
              key={d.iso}
              className={`grid grid-cols-[80px_1fr_120px] items-center px-4 py-2.5 border-t text-sm ${
                d.isToday ? "bg-blue-50/50" : ""
              }`}
            >
              <div>
                <div className="font-semibold text-gray-800">{d.label}</div>
                <div className="text-[10px] text-gray-500">{d.dateLabel}</div>
              </div>
              <div className="text-xs">
                {isFetching ? (
                  <span className="text-gray-400">Loading…</span>
                ) : d.isFuture ? (
                  <span className="text-gray-400">Future</span>
                ) : existingHours > 0 ? (
                  <span className="text-green-600 font-semibold">
                    Already logged: {existingHours.toFixed(1)}h
                  </span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                placeholder="0"
                value={hoursMap[d.iso] || ""}
                disabled={locked}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d*\.?\d*$/.test(v)) {
                    setHoursMap((p) => ({ ...p, [d.iso]: v }));
                  }
                }}
                className={`${inputClass} text-right disabled:opacity-50`}
              />
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description (applied to all days)</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional — defaults to 'Weekly log — <Day>'"
          className={inputClass}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-sm">
          <span className="text-gray-500">Total new hours: </span>
          <span className="font-bold text-blue-600">
            {totalNewHours.toFixed(1)}h
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isLoading || totalNewHours <= 0}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Saving..." : "Log Week"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimesheetEntryModal;
