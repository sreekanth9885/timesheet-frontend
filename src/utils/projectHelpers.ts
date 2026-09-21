import type { ProjectPriority, ProjectStatus } from "../types/projectTypes";

export const PROJECT_STATUS_BADGE: Record<ProjectStatus, string> = {
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  draft: "bg-sky-100 text-sky-700",
  on_hold: "bg-amber-100 text-amber-700",
  cancelled: "bg-gray-200 text-gray-700",
};

export const PROJECT_PRIORITY_BADGE: Record<ProjectPriority, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-700",
};

export const getStatusBadge = (status?: string) =>
  PROJECT_STATUS_BADGE[(status as ProjectStatus) ?? "active"] ??
  PROJECT_STATUS_BADGE.active;

export const getPriorityBadge = (priority?: string) =>
  PROJECT_PRIORITY_BADGE[(priority as ProjectPriority) ?? "medium"] ??
  PROJECT_PRIORITY_BADGE.medium;

export const formatDate = (value?: string | null) =>
  value ? value.split("T")[0] : "N/A";

export const generateProjectCode = () =>
  `PRJ-${Math.floor(100 + Math.random() * 900)}`;
