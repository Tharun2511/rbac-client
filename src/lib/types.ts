export type Role = "USER" | "MANAGER" | "RESOLVER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_by: string;
  resolver_id?: string;
}
