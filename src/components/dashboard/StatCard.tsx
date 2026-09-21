import type { DashboardStat, StatAccent } from "../../types/dashboardTypes";

const ACCENT_TEXT: Record<StatAccent, string> = {
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-amber-500",
  info: "text-sky-500",
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`shrink-0 ${ACCENT_TEXT[stat.accent]}`}>{stat.icon}</div>
      <div className="min-w-0">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
          {stat.value}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
}
