import { apiClient as api } from "../api";
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
  return await api<IUser>("/users", {
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
  return await api<IUser>("/users", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  return await api<IUser>(`/users/status/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status: isActive }),
  });
}

export async function updateUserRole(userId: string, role: IRole) {
  return await api<IUser>(`/users/role/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ role }),
  });
}

export async function getAllUsers() {
  return await api<IUser[]>("/users", {
    method: "GET",
    auth: true,
  });
}

export async function getAllResolvers() {
  return await api<IUser[]>("/users/resolvers", {
    method: "GET",
    auth: true,
  });
}
