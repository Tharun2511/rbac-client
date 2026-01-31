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

export interface IComment {
  id: string;
  comment: string;
  ticketId: string;
  userId: string;
  user: IUser;
  createdAt: string; // or Date, but API usually parses to string first
}

export interface ITimelineItem {
  id: string;
  createdAt: string;
  type: string;
  userName: string;
  userRole: string;
  metadata?: Record<string, any>;
  comment?: string;
  resolver?: IUser;
}
