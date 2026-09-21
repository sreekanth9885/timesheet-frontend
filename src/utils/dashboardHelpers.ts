import type { DashboardStats } from "../types/dashboardTypes";

const n = (v: unknown) => Number(v ?? 0);

export const statValues = {
  admin: (s: DashboardStats) => [
    String(s.totalEmployees ?? 0),
    String(s.activeProjects ?? 0),
    String(s.pendingApprovals?.total ?? 0),
    `${n(s.todaysTotalHours).toFixed(1)}h`,
  ],
  employee: (s: DashboardStats) => [
    `${n(s.hours?.week).toFixed(1)}h`,
    `${n(s.hours?.today).toFixed(1)}h`,
    String(s.activeAssignedTasks ?? 0),
    `${n(s.hours?.month).toFixed(1)}h`,
  ],
};

export const statLabels = {
  admin: [
    "Active Employees",
    "Active Projects",
    "Pending Approvals",
    "Today's Total Hours",
  ],
  employee: [
    "Hours This Week",
    "Today's Logged Hours",
    "Assigned Active Tasks",
    "Hours This Month",
  ],
};

export const formatWeekday = (val?: string) =>
  val ? val.split("T")[0] : "Today";

export const formatHours = (val: number) => `${Number(val ?? 0).toFixed(1)}h`;

export const formatHoursBold = (val: number) =>
  `${Number(val ?? 0).toFixed(1)}h`;

/** Original hard-coded placeholder data — kept intentionally for parity. */
export const WEEKLY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const WEEKLY_ADMIN_DATA = [42, 48, 45, 52, 40, 10, 5];
export const WEEKLY_EMPLOYEE_DATA = [8, 8, 8.5, 7.5, 8, 0, 0];
