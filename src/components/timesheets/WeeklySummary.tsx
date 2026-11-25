// src/components/timesheets/WeeklySummary.tsx
import { useMemo } from "react";
import type { TimesheetEntry } from "../../types/timesheet";

interface WeeklySummaryProps {
  weekEntries: TimesheetEntry[];
  dailyTarget?: number;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toLocalISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/** Normalize any API date → YYYY-MM-DD using local getters. */
const toDateKey = (value: string | null | undefined): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : toLocalISO(d);
};

/** Fallback hours calc if `total_hours` is ever null. */
const entryHours = (e: TimesheetEntry): number => {
  if (e.total_hours != null) return Number(e.total_hours) || 0;
  if (e.start_time && e.end_time) {
    const [sh, sm] = e.start_time.split(":").map(Number);
    const [eh, em] = e.end_time.split(":").map(Number);
    let mins = eh * 60 + em - (sh * 60 + sm);
    if (mins < 0) mins += 1440;
    return Math.max(0, mins - Number(e.break_minutes || 0)) / 60;
  }
  return 0;
};

const getWeekDates = (anchorISO?: string) => {
  const [y, m, d] = (anchorISO || toLocalISO(new Date()))
    .split("-")
    .map(Number);
  const anchor = new Date(y, m - 1, d);
  const dow = anchor.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(y, m - 1, d + mondayOffset + i);
    return {
      iso: toLocalISO(day),
      label: DAY_LABELS[i],
      dateLabel: day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
};

const WeeklySummary = ({
  weekEntries = [],
  dailyTarget = 8,
}: WeeklySummaryProps) => {
  const todayISO = toLocalISO(new Date());

  const { days, weekTotal, weekTarget } = useMemo(() => {
    const hoursByDate: Record<string, number> = {};
    for (const e of weekEntries) {
      const iso = toDateKey(e.date);
      if (!iso) continue;
      hoursByDate[iso] = (hoursByDate[iso] || 0) + entryHours(e);
    }

    const dates = getWeekDates();
    const days = dates.map((d) => ({
      ...d,
      hours: hoursByDate[d.iso] || 0,
      isToday: d.iso === todayISO,
      isFuture: d.iso > todayISO,
      isWeekend: d.label === "Sat" || d.label === "Sun",
    }));

    return {
      days,
      weekTotal: days.reduce((s, d) => s + d.hours, 0),
      weekTarget: dailyTarget * 5,
    };
  }, [weekEntries, dailyTarget, todayISO]);

  const pct = Math.min((weekTotal / weekTarget) * 100, 100);
  const isOver = weekTotal > weekTarget;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Weekly Hours Overview
        </h3>
        <span className="text-[11px] text-gray-500">
          {days[0].dateLabel} – {days[6].dateLabel}
        </span>
      </div>

      <div className="mb-4 mt-2">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-lg font-bold text-gray-800">
            {weekTotal.toFixed(1)}h{" "}
            <span className="text-xs text-gray-500 font-normal">
              / {weekTarget}h target
            </span>
          </span>
          {isOver && (
            <span className="text-[11px] font-semibold text-amber-500">
              + Overtime
            </span>
          )}
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOver ? "bg-amber-500" : "bg-blue-600"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {days.map((d) => {
          const met = d.hours >= dailyTarget;
          const hasHours = d.hours > 0;
          return (
            <div
              key={d.iso}
              className={`flex justify-between items-center px-3.5 py-2.5 rounded-lg transition-all ${
                d.isToday
                  ? "bg-blue-50 border border-blue-300"
                  : d.isWeekend
                    ? "bg-gray-50/60 border border-gray-100"
                    : "bg-gray-50 border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    d.isToday
                      ? "bg-blue-600"
                      : met
                        ? "bg-green-500"
                        : hasHours
                          ? "bg-blue-400"
                          : d.isFuture
                            ? "bg-gray-200"
                            : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-sm ${
                    d.isToday ? "font-bold text-blue-700" : "text-gray-700"
                  }`}
                >
                  {d.label}
                </span>
                <span className="text-[10px] text-gray-400">{d.dateLabel}</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  d.isToday
                    ? "text-blue-700"
                    : met
                      ? "text-green-600"
                      : hasHours
                        ? "text-gray-800"
                        : "text-gray-300"
                }`}
              >
                {hasHours ? `${d.hours.toFixed(1)}h` : "–"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummary;
