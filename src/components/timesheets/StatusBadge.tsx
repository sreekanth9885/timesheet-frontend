// src/components/timesheets/StatusBadge.tsx
import type { TimesheetStatus } from "../../types/timesheet";

const styles: Record<TimesheetStatus, string> = {
  approved: "bg-green-100 text-green-700 border-green-200",
  submitted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
};

const StatusBadge = ({ status }: { status?: TimesheetStatus }) => {
  const s = (status || "draft") as TimesheetStatus;
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-semibold uppercase rounded-md border ${styles[s]}`}
    >
      {s}
    </span>
  );
};

export default StatusBadge;
