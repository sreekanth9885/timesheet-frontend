import type { EmployeeStatus } from "../types/employeeTypes";

export const STATUS_BADGE: Record<EmployeeStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-amber-100 text-amber-700",
  terminated: "bg-red-100 text-red-700",
};

export const getStatusBadge = (status?: string): string =>
  STATUS_BADGE[(status as EmployeeStatus) ?? "active"] ?? STATUS_BADGE.active;

export const getInitials = (first?: string, last?: string): string =>
  ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() ||
  (first?.[0] ?? "U").toUpperCase();

export const generateEmployeeId = (): string =>
  `EMP${Math.floor(100 + Math.random() * 900)}`;

/** Strips create-only fields — keeps payload aligned with the original. */
export const toUpdatePayload = (
  form: import("../types/employeeTypes").EmployeeFormData,
) => {
  const { employee_id: _i, email: _e, password: _p, ...rest } = form;
  return rest;
};
