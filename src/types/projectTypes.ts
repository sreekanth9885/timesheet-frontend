export type ProjectStatus =
  | "active"
  | "draft"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "critical";

export interface Project {
  id: number;
  project_code: string;
  name: string;
  client_name?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget_hours?: number;
  estimated_hours?: number;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
}

/** Payload sent to POST/PUT /projects. */
export interface ProjectFormData {
  project_code?: string;
  name: string;
  client_name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget_hours: number;
  estimated_hours: number;
  start_date: string | null;
  end_date: string | null;
  description: string;
}

export interface ProjectEmployee {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  employee_id?: string;
  allocation_percentage: number;
}

export interface ProjectFilters {
  search: string;
  status: string;
}

export type ProjectViewMode = "grid" | "table";
