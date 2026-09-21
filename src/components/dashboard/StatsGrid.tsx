import type { DashboardStat } from "../../types/dashboardTypes";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((s) => (
        <StatCard key={s.key} stat={s} />
      ))}
    </div>
  );
}
