import type { DepartmentStatus } from "../types/departmentTypes";

export const STATUS_BADGE: Record<DepartmentStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-200 text-gray-700",
};

export const getStatusBadge = (status?: string): string =>
  STATUS_BADGE[(status as DepartmentStatus) ?? "active"] ?? STATUS_BADGE.active;

export const formatMemberCount = (count?: number): string =>
  `${count ?? 0} Member${count === 1 ? "" : "s"}`;
