import { IUser } from "./types";
import { getAuthUser } from "./auth";

export function requireAuth(): IUser | null {
  const user = getAuthUser();
  return user ?? null;
}

export function requireRole(allowedRoles: IUser["role"][]) {
  const user = getAuthUser();

  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return user;
}
