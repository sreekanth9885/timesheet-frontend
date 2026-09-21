export type EmployeeStatus = "active" | "inactive" | "terminated";

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  mobile?: string;
  department_id?: number | null;
  department_name?: string | null;
  designation?: string;
  role_id: number;
  role_name?: string;
  status: EmployeeStatus;
}

/** Payload for POST/PUT /employees. */
export interface EmployeeFormData {
  // create-only (ignored on update)
  employee_id?: string;
  email?: string;
  password?: string;

  // shared
  first_name: string;
  last_name: string;
  mobile: string;
  department_id: number | null;
  designation: string;
  role_id: number;
}

export interface EmployeeQueryParams {
  search?: string;
  department_id?: string;
  status?: string;
  limit?: number;
}

export interface EmployeeFilters {
  search: string;
  department_id: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
