export interface IUser {
  id: string;
  name: string;
  email: string;
  isSystemAdmin: boolean;
  isActive: boolean;
  role?: string; // Org-level role (only present when queried in org context)
}

export interface IOrgContext {
  id: string;
  name: string;
  slug: string;
}

export interface IProjectContext {
  id: string;
  name: string;
  slug: string;
  orgId: string;
}

export interface IProject {
  id: string;
  name: string;
  slug: string;
  orgId: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
  contexts: {
    organizations: IOrgContext[];
    projects: IProjectContext[];
  };
}

export interface ITicket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  creatorName?: string;
  creatorEmail?: string;
  resolverId?: string;
  resolverName?: string;
  resolverEmail?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type?: "BUG" | "FEATURE" | "SUPPORT" | "GENERAL" | "TICKET";
  orgId: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  id: string;
  comment: string;
  ticketId: string;
  userId: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
}

export interface ITimelineItem {
  id: string;
  createdAt: string;
  type: string;
  userName: string;
  userRole: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  comment?: string;
  resolver?: { id: string; name: string; email: string };
}
