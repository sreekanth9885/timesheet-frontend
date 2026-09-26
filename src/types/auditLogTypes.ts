export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT";

export type AuditLog = {
  id: number;
  created_at?: string;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  action: string;
  table_name?: string;
  record_id?: number;
  ip_address?: string;
  user_agent?: string;
  /** May arrive as a JSON string OR as a parsed object. */
  old_values?: unknown;
  new_values?: unknown;
};

export type AuditLogFilters = {
  search: string;
  action: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
