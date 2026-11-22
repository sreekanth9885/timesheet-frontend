import { Link } from "react-router-dom";
import type { DashboardStat, StatAccent } from "../../types/dashboardTypes";

const ACCENT_TEXT: Record<StatAccent, string> = {
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-amber-500",
  info: "text-sky-500",
};

const CARD_BASE =
  "bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4";

export function StatCard({ stat }: { stat: DashboardStat }) {
  const inner = (
    <>
      <div className={`shrink-0 ${ACCENT_TEXT[stat.accent]}`}>{stat.icon}</div>
      <div className="min-w-0">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
          {stat.value}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
      </div>
    </>
  );

  // Not clickable
  if (!stat.to) {
    return <div className={CARD_BASE}>{inner}</div>;
  }

  // Clickable — hovers + keyboard focus
  return (
    <Link
      to={stat.to}
      className={`${CARD_BASE} transition-all duration-150
        hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        focus-visible:ring-offset-2 cursor-pointer`}
    >
      {inner}
    </Link>
  );
}
