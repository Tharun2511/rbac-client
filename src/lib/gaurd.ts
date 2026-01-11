import { AuthUser } from "./types";
import { getAuthUser } from "./auth";

export function requireAuth(): AuthUser | null {
  const user = getAuthUser();
  return user ?? null;
}

export function requireRole(allowedRoles: AuthUser["role"][]) {
  const user = getAuthUser();

  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return user;
}
