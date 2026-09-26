import type { AuditAction } from "../types/auditLogTypes";

/** Action → tailwind badge classes. */
const ACTION_BADGE: Record<AuditAction, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  APPROVE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  REJECT: "bg-red-100 text-red-700",
  LOGIN: "bg-sky-100 text-sky-700",
  LOGOUT: "bg-gray-100 text-gray-700",
};

export const getActionBadge = (action?: string): string =>
  ACTION_BADGE[action as AuditAction] ?? "bg-gray-100 text-gray-700";

/** "2024-01-15T14:32:11.123Z" → "2024-01-15 14:32:11" (matches original). */
export const formatTimestamp = (val?: string): string =>
  val ? val.replace("T", " ").substring(0, 19) : "—";

/** Parse a value that may be a JSON string, an object, or null/undefined. */
export const parseMaybeJson = (value: unknown): unknown => {
  if (value == null) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
};

/** Resolve the human-readable actor from the row, matching original logic. */
export const getActorLabel = (row: {
  first_name?: string;
  last_name?: string;
  user_id?: number;
}): string => {
  if (row.first_name) {
    return `${row.first_name} ${row.last_name ?? ""}`.trim();
  }
  if (row.user_id) return `User #${row.user_id}`;
  return "System";
};
