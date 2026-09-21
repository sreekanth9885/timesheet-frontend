// src/types/timesheet.ts
export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export interface TimesheetEntry {
  id: number;
  project_id: number;
  task_id: number | null;
  date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  total_hours: number;
  description: string;
  work_summary?: string;
  status: TimesheetStatus;
}

export interface Project {
  id: number;
  name: string;
  project_code: string;
}
export interface CreateTimesheetDto {
  date: string;
  project_id: number;
  task_id: number | null;
  start_time: string;
  end_time: string;
  break_minutes: number;
  description: string;
  work_summary: string;
}

// Generic API wrapper matching your backend response shape
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
