import type { RecentTimesheet } from "../../types/dashboardTypes";
import { formatHours, formatWeekday } from "../../utils/dashboardHelpers";

const STATUS_BADGE: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  submitted: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
};

interface Props {
  entries: RecentTimesheet[];
  isLoading: boolean;
  isError: boolean;
}

export function RecentTimesheets({ entries, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading recent timesheet entries...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load recent activity.
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent timesheet activity.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Date</th>
            <th className="text-left px-4 py-3 font-medium">Project</th>
            <th className="text-left px-4 py-3 font-medium">Hours</th>
            <th className="text-left px-4 py-3 font-medium">Description</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">
                {formatWeekday(e.date)}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-800">
                {e.project_name ?? `Project #${e.project_id}`}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-800">
                {formatHours(e.total_hours)}
              </td>
              <td className="px-4 py-3 max-w-[200px]">
                <div className="truncate text-[13px] text-gray-500">
                  {e.description || "—"}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    STATUS_BADGE[e.status ?? "draft"] ?? STATUS_BADGE.draft
                  }`}
                >
                  {(e.status || "draft").toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
