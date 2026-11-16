export interface User extends OrganizationInfo {
  id: number;
  employee_id: string;
  name?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string | null;
  department_id?: number | null;
  designation?: string | null;
  role_id: number;
  role: "admin" | "employee" | "super_admin";
  status?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OrganizationInfo {
  organization_id: number;
  organization_name: string;
  organization_code: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: { token: string; user: User };
}

export interface RegisterOrganizationRequest {
  company_name: string;
  contact_person: string;
  email: string;
  mobile?: string;
  password: string;
}

export interface RegisterOrganizationResponse {
  success: boolean;
  message: string;
  data: { organization_id: number; admin_user_id: number; status: string };
}

export type OrganizationStatus =
  | "pending"
  | "active"
  | "rejected"
  | "suspended"
  | "inactive";

export interface PendingOrganization {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  status: OrganizationStatus; // ← narrowed from `string`
  created_at: string;

  // Present in GET /super-admin/organizations (all) but not /pending:
  code?: string;
  rejection_reason?: string | null;

  // Present in GET /super-admin/organizations/pending only:
  admin_user_id?: number;
  admin_first_name?: string;
  admin_last_name?: string;
  admin_email?: string;
}
