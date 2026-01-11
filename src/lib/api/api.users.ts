import { api } from "../api";
import { AuthUser, Role } from "../types";

export interface User extends AuthUser {
  is_active: boolean;
}

export function getUsers() {
  return api<User[]>("/users", { auth: true });
}

export function updateUserStatus(userId: string, isActive: boolean) {
  return api<User>(`/users/${userId}/status`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ isActive }),
  });
}

export function updateUserRole(userId: string, role: Role) {
  return api<User>(`/users/${userId}/role`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ role }),
  });
}
