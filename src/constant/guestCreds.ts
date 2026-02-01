type Role = "admin" | "user" | "manager" | "resolver";

export const GUEST_CREDENTIALS: Record<
  Role,
  { email: string; password: string }
> = {
  admin: { email: "guest@admin.com", password: "admin@123" },
  user: { email: "guest@user.com", password: "user@123" },
  manager: { email: "guest@manager.com", password: "manager@123" },
  resolver: { email: "guest@resolver.com", password: "resolver@123" },
};
