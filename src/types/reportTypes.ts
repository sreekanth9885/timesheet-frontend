export type ReportType =
  | "employee"
  | "project"
  | "task"
  | "overtime"
  | "department";

export type EmployeeReportRow = {
  first_name: string;
  last_name?: string;
  total_hours: number;
  entries_count: number;
};

export type ProjectReportRow = {
  name: string;
  budget_hours: number;
  actual_hours: number;
  budget_utilization_percent: number;
};

export type TaskReportRow = {
  status: string;
  task_count: number;
  total_estimated: number;
  total_actual: number;
};

export type OvertimeReportRow = {
  first_name: string;
  last_name?: string;
  total_overtime: number;
  request_count: number;
};

export type DepartmentReportRow = {
  name: string;
  employee_count: number;
  total_hours: number;
};

export type ReportRow =
  | EmployeeReportRow
  | ProjectReportRow
  | TaskReportRow
  | OvertimeReportRow
  | DepartmentReportRow;

export type ReportQueryParams = {
  reportType: ReportType;
  start_date: string;
  end_date: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
