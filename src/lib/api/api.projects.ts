import { apiClient } from "../api";
import { IProject } from "../types";

export interface ProjectMember {
  id: string; // member ID
  userId: string;
  name: string;
  email: string;
  roleName: string;
}

export interface OrgUser {
  id: string;
  name: string;
  email: string;
}

export interface ProjectRole {
  id: string;
  name: string;
  scope: string;
}

export const updateProject = async (id: string, name: string) => {
  return apiClient<IProject>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
    auth: true,
  });
};

export const deleteProject = async (id: string) => {
  return apiClient<{ message: string }>(`/projects/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const getProjectMembers = async (id: string) => {
  return apiClient<ProjectMember[]>(`/projects/${id}/members`, {
    auth: true,
  });
};

export const removeMember = async (projectId: string, userId: string) => {
  return apiClient<{ message: string }>(
    `/projects/${projectId}/members/${userId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
};

export const addMemberToProject = async (
  projectId: string,
  userId: string,
  roleId: string,
  orgId: string,
) => {
  return apiClient<ProjectMember>(`/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId, roleId, orgId }),
    auth: true,
  });
};

export const getOrgUsersForProject = async (
  orgId: string,
  projectId: string,
) => {
  return apiClient<OrgUser[]>(
    `/users/available-for-project?orgId=${orgId}&projectId=${projectId}`,
    {
      auth: true,
    },
  );
};

export const getProjectRoles = async () => {
  return apiClient<ProjectRole[]>(`/users/roles?scope=PROJECT`, {
    auth: true,
  });
};
