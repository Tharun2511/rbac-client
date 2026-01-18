import { api } from "../api";
import { IRole, IUser } from "../types";

export function getUsers() {
  return api<IUser[]>("/users", { auth: true });
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return api<IUser>("/users", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateUser(payload: {
  name: string;
  email: string;
  role: string;
}) {
  return api<IUser>("/users", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateUserStatus(userId: string, isActive: boolean) {
  return api<IUser>(`/users/status/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status: isActive }),
  });
}

export function updateUserRole(userId: string, role: IRole) {
  return api<IUser>(`/users/role/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ role }),
  });
}
