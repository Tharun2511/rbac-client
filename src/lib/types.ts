export type IRole = "USER" | "MANAGER" | "RESOLVER" | "ADMIN";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}

export interface ITicket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_by: string;
  resolver_id?: string;
}
