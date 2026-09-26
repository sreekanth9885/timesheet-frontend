export type OvertimeStatus = "pending" | "approved" | "rejected";

export interface OvertimeRecord {
  id: number;
  first_name?: string;
  last_name?: string;
  emp_code?: string;
  date?: string;
  extra_hours: number;
  reason?: string;
  proof_file?: string;
  status: OvertimeStatus;
  remarks?: string;
}

/** Values the form collects before being wrapped into FormData. */
export interface OvertimeClaimInput {
  date: string;
  extra_hours: number;
  reason: string;
  proof?: File | null;
}

export interface OvertimeFilters {
  search: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
