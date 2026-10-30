import { Link } from "react-router-dom";
import { CalendarCheck, Clock, FolderKanban, Users } from "lucide-react"; // any icon lib, or inline SVGs

import {
  useGetDashboardStatsQuery,
  useGetRecentTimesheetsQuery,
} from "../services/dashboardApi";
import {
  WEEKLY_ADMIN_DATA,
  WEEKLY_EMPLOYEE_DATA,
  WEEKLY_LABELS,
  statLabels,
  statValues,
} from "../utils/dashboardHelpers";
import type { DashboardStat } from "../types/dashboardTypes";
import { useAppSelector } from "../store/hooks";
import { useGetProjectsQuery } from "../services/projectsApi";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { HoursBarChart } from "../components/dashboard/HoursBarChart";
import { ProjectsPieChart } from "../components/dashboard/ProjectsPieChart";
import { RecentTimesheets } from "../components/dashboard/RecentTimesheets";

const ICON_CLASS = "w-6 h-6";
const MAX_RECENT = 5;

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === "admin";

  const { data: stats = {} } = useGetDashboardStatsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const {
    data: recentAll = [],
    isLoading: recentLoading,
    isError: recentError,
  } = useGetRecentTimesheetsQuery({ scope: isAdmin ? "all" : "mine" });

  // ── 1. Build the four stat cards from role + fetched data ────────────────
  const role = isAdmin ? "admin" : "employee";
  const values = statValues[role](stats);
  const labels = statLabels[role];
  const icons = [
    <Users key="u" className={ICON_CLASS} strokeWidth={2} />,
    <FolderKanban key="f" className={ICON_CLASS} strokeWidth={2} />,
    <Clock key="c" className={ICON_CLASS} strokeWidth={2} />,
    <CalendarCheck key="a" className={ICON_CLASS} strokeWidth={2} />,
  ];
  const accents: DashboardStat["accent"][] = [
    "primary",
    "success",
    "warning",
    "info",
  ];

  const statCards: DashboardStat[] = values.map((value, i) => ({
    key: labels[i],
    label: labels[i],
    value,
    icon: icons[i],
    accent: accents[i],
  }));

  // ── 2. Projects pie chart buckets (same rules as the vanilla version) ────
  const activeCount = projects.filter((p) => p.status === "active").length || 1;
  const draftCount = projects.filter((p) => p.status === "draft").length || 1;
  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const holdCount = projects.filter((p) => p.status === "on_hold").length;

  // ── 3. Weekly bar chart (still placeholder data — matches original) ──────
  const weeklyData = isAdmin ? WEEKLY_ADMIN_DATA : WEEKLY_EMPLOYEE_DATA;

  // ── 4. Recent activity — slice to 5 ──────────────────────────────────────
  const recent = recentAll.slice(0, MAX_RECENT);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back,{" "}
            <strong className="text-gray-800">{user?.name ?? "User"}</strong>{" "}
            <span className="text-gray-400">
              ({isAdmin ? "Administrator" : "Employee"})
            </span>
          </p>
        </div>

        {/* <Link
          to="/timesheets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Log Time
        </Link> */}
      </div>

      {/* Stats */}
      <StatsGrid stats={statCards} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Weekly Hours Summary
          </h3>
          <HoursBarChart
            labels={WEEKLY_LABELS}
            data={weeklyData}
            seriesName="Hours Logged"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Project Status Breakdown
          </h3>
          <ProjectsPieChart
            labels={["Active", "Planning / Draft", "Completed", "On Hold"]}
            values={[activeCount, draftCount, completedCount, holdCount]}
          />
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Recent Timesheet Activity
          </h3>
          <Link
            to="/timesheets"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <RecentTimesheets
          entries={recent}
          isLoading={recentLoading}
          isError={recentError}
        />
      </div>
    </div>
  );
}
