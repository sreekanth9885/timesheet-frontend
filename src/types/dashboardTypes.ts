import type { ReactNode } from "react";

export interface DashboardStats {
  // admin-only fields
  totalEmployees?: number;
  activeProjects?: number;
  pendingApprovals?: { total: number };
  todaysTotalHours?: number;

  // employee-only fields
  activeAssignedTasks?: number;
  hours?: {
    week?: number;
    today?: number;
    month?: number;
  };
}

export interface RecentTimesheet {
  id: number;
  date?: string;
  project_id: number;
  project_name?: string;
  total_hours: number;
  description?: string;
  status: "draft" | "submitted" | "approved" | "rejected" | string;
}

export type StatAccent = "primary" | "success" | "warning" | "info";

export interface DashboardStat {
  key: string;
  label: string;
  value: string;
  icon: ReactNode;
  accent: StatAccent;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
