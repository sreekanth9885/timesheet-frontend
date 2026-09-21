export type DepartmentStatus = "active" | "inactive";

export interface Department {
  id: number;
  name: string;
  description?: string;
  employee_count?: number;
  status: DepartmentStatus;
}

/** Payload for POST/PUT /departments. */
export interface DepartmentFormData {
  name: string;
  description: string;
  status: DepartmentStatus;
}

export interface DepartmentFilters {
  search: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
