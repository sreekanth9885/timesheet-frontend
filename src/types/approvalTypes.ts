export type ApprovalTab = "timesheets" | "tasks" | "overtime";
export type ApprovalEntityType = "timesheet" | "task" | "overtime";

export interface PendingTimesheet {
  id: number;
  first_name: string;
  last_name?: string;
  project_name?: string;
  date?: string;
  total_hours: number;
  description?: string;
}

export interface PendingTask {
  id: number;
  first_name: string;
  last_name?: string;
  name: string;
  project_name?: string;
  estimated_hours?: number;
}

export interface PendingOvertime {
  id: number;
  first_name: string;
  last_name?: string;
  date?: string;
  extra_hours: number;
  reason?: string;
}

export interface PendingApprovals {
  timesheets: PendingTimesheet[];
  tasks: PendingTask[];
  overtime: PendingOvertime[];
}

export interface ApprovalDecision {
  entity_type: ApprovalEntityType;
  entity_id: number;
  comments: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
