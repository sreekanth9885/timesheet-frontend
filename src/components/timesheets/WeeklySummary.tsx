// src/components/timesheets/WeeklySummary.tsx
import type { TimesheetEntry } from "../../types/timesheet";

interface WeeklySummaryProps {
  todayEntries: TimesheetEntry[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const WeeklySummary = ({ todayEntries }: WeeklySummaryProps) => {
  const todayIndex = new Date().getDay() - 1; // Mon=0 ... Fri=4

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Weekly Hours Overview
      </h3>
      <div className="flex flex-col gap-2.5">
        {DAYS.map((day, idx) => {
          const isToday = idx === todayIndex;
          const totalHours = isToday
            ? todayEntries.reduce((a, b) => a + Number(b.total_hours || 0), 0)
            : 8;

          return (
            <div
              key={day}
              className={`flex justify-between items-center px-3.5 py-3 rounded-lg transition-all ${
                isToday
                  ? "bg-blue-50 border border-blue-300 text-blue-700 font-bold"
                  : "bg-gray-50 border border-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isToday ? "bg-blue-600" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm">{day}</span>
              </div>
              <span className="font-bold text-sm">
                {totalHours.toFixed(1)}h
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummary;
