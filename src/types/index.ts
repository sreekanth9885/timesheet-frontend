// src/types/index.ts
export interface User {
  id: number;
  employee_id?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  mobile?: string;
  department_id?: number;
  designation?: string;
  role_id: number;
  role: "admin" | "employee";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}
