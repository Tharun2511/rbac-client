import { apiClient as api } from "../api";
import { IUser } from "../types";

export type IRole = string;

export interface IOrgBasic {
  id: string;
  name: string;
  slug: string;
}

export function getUsers() {
  return api<IUser[]>("/users", { auth: true });
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  orgId: string;
}) {
  return await api<IUser>("/users", {
    method: "POST",
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

export async function getAllUsers() {
  return await api<IUser[]>("/users", {
    method: "GET",
    auth: true,
  });
}

export async function getOrganizations() {
  return await api<IOrgBasic[]>("/organizations", {
    method: "GET",
    auth: true,
  });
}

export async function updateUserRole(userId: string, role: IRole) {
  return await api<IUser>(`/users/role/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ role }),
  });
}

export async function getAllResolvers() {
  return await api<IUser[]>("/users/resolvers", {
    method: "GET",
    auth: true,
  });
}
