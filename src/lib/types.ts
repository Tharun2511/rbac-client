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
  createdBy: string;
  createdUser: IUser;
  resolverId?: string;
  resolver: IUser;
  createdAt: Date;
}
