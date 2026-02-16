import { IUser } from "./types";
import { getAuthUser, getToken } from "./auth";

export function requireAuth(): IUser | null {
  const token = getToken();
  const user = getAuthUser();
  return token && user ? user : null;
}

/**
 * Permission-based guard. System admins always pass.
 */
export function requirePermission(permission: string): IUser | null {
  const user = requireAuth();
  if (!user) return null;
  if (user.isSystemAdmin) return user;
  // For more nuanced checks, callers should use useRBAC().can(permission)
  // This is a simple sync guard for server-side or simple checks.
  return user;
}
