type Role = "admin" | "user" | "manager" | "resolver";

export const GUEST_CREDENTIALS: Record<
  Role,
  { email: string; password: string }
> = {
  admin: { email: "admin@admin.com", password: "admin@123" },
  user: { email: "user@user.com", password: "user@123" },
  manager: { email: "manager@manager.com", password: "manager@123" },
  resolver: { email: "resolver@resolver.com", password: "resolver@123" },
};
