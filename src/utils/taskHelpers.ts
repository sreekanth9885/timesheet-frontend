import type { TaskPriority } from "../../src/types/taskTypes";

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-700",
};

export const getPriorityBadge = (priority: string): string =>
  PRIORITY_BADGE[(priority?.toLowerCase() as TaskPriority) ?? "medium"] ??
  PRIORITY_BADGE.medium;

export const formatDueDate = (value?: string | null): string =>
  value ? value.split("T")[0] : "—";

export const getAssigneeName = (task: {
  assignee_first?: string;
  assignee_last?: string;
}): string =>
  task.assignee_first
    ? `${task.assignee_first} ${task.assignee_last ?? ""}`.trim()
    : "Unassigned";
