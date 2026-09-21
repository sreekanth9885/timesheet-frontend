export type TaskStatus = "pending" | "in_progress" | "completed" | "on_hold";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: number;
  name: string;
  description?: string;
  project_id: number;
  project_name?: string;
  assigned_to?: number | null;
  assignee_first?: string;
  assignee_last?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  estimated_hours?: number;
  is_employee_created?: boolean;
}

export interface Project {
  id: number;
  name: string;
  project_code?: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name?: string;
  employee_id: string;
}

export interface TaskFilters {
  search: string;
  project_id: string;
  status: string;
  priority: string;
}

/** Payload sent to POST/PUT /tasks — decoupled from the read model. */
export interface TaskFormData {
  name: string;
  project_id: number;
  assigned_to: number | null;
  priority: TaskPriority;
  estimated_hours: number;
  due_date: string | null;
  description: string;
}

export interface TaskQueryParams {
  project_id?: string;
  status?: string;
  priority?: string;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
