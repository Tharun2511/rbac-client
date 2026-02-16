export type GuestRole =
  | "sysadmin"
  | "orgOwner"
  | "orgAdmin"
  | "projectAdmin"
  | "resolver"
  | "client"
  | "viewer";

interface GuestCredential {
  email: string;
  password: string;
  label: string;
  description: string;
}

export const GUEST_CREDENTIALS: Record<GuestRole, GuestCredential> = {
  sysadmin: {
    email: "admin@system.com",
    password: "admin123",
    label: "System Admin",
    description: "Full platform access",
  },
  orgOwner: {
    email: "owner@acme.com",
    password: "owner123",
    label: "Org Owner",
    description: "Manages Acme Corp",
  },
  orgAdmin: {
    email: "orgadmin@acme.com",
    password: "orgadmin123",
    label: "Org Admin",
    description: "Acme Corp admin",
  },
  projectAdmin: {
    email: "projadmin@acme.com",
    password: "projadmin123",
    label: "Project Admin",
    description: "Project Alpha lead",
  },
  resolver: {
    email: "resolver@acme.com",
    password: "resolver123",
    label: "Resolver",
    description: "Resolves tickets",
  },
  client: {
    email: "client@acme.com",
    password: "client123",
    label: "Client",
    description: "Creates & views tickets",
  },
  viewer: {
    email: "viewer@acme.com",
    password: "viewer123",
    label: "Viewer",
    description: "Read-only access",
  },
};
