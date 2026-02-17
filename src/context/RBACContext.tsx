"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { IOrgContext, IProjectContext } from "@/lib/types";
import {
  getActiveOrg,
  getActiveProject,
  saveActiveOrg,
  saveActiveProject,
  clearActiveProject,
} from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface RBACContextType {
  // Contexts available to the user
  organizations: IOrgContext[];
  projects: IProjectContext[];

  // Currently active context
  activeOrgId: string | undefined;
  activeProjectId: string | undefined;

  // User permissions within the current context
  permissions: string[];

  // Setters
  setActiveOrg: (orgId: string) => void;
  setActiveProject: (projectId: string | undefined) => void;

  // Helpers
  can: (permission: string) => boolean;
  isSystemAdmin: boolean;

  // Loading state for context / permissions
  isLoadingContexts: boolean;

  // Refresh contexts (e.g., after creating a project)
  refreshContexts: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [organizations, setOrganizations] = useState<IOrgContext[]>([]);
  const [projects, setProjects] = useState<IProjectContext[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string | undefined>(
    undefined,
  );
  const [activeProjectId, setActiveProjectIdState] = useState<
    string | undefined
  >(undefined);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoadingContexts, setIsLoadingContexts] = useState(true);

  // Hydrate active context from localStorage
  useEffect(() => {
    setActiveOrgIdState(getActiveOrg());
    setActiveProjectIdState(getActiveProject());
  }, []);

  // loadContexts: fetch user's orgs & projects from backend
  const loadContexts = useCallback(async () => {
    try {
      setIsLoadingContexts(true);
      const data = await apiClient<{
        organizations: IOrgContext[];
        projects: IProjectContext[];
      }>("/auth/me/contexts", { auth: true });

      setOrganizations(data.organizations || []);
      setProjects(data.projects || []);

      const orgs = data.organizations || [];
      const projs = data.projects || [];

      // Validate stored org — if stale (e.g., after re-seed), clear it
      let currentOrg = getActiveOrg();
      if (currentOrg && !orgs.find((o) => o.id === currentOrg)) {
        currentOrg = undefined; // stale — will trigger auto-select below
      }

      // Auto-select org if none is valid — pick first available
      if (!currentOrg && orgs.length > 0) {
        currentOrg = orgs[0].id;
        setActiveOrgIdState(currentOrg);
        saveActiveOrg(currentOrg);
      }

      // Auto-select project within the active org
      if (currentOrg) {
        let currentProject = getActiveProject();
        const orgProjects = projs.filter((p) => p.orgId === currentOrg);

        // Validate stored project — clear if stale
        if (
          currentProject &&
          !orgProjects.find((p) => p.id === currentProject)
        ) {
          currentProject = undefined;
          clearActiveProject();
        }

        // Auto-select first project if none selected
        if (!currentProject && orgProjects.length > 0) {
          currentProject = orgProjects[0].id;
          setActiveProjectIdState(currentProject);
          saveActiveProject(currentProject);
        }
      }
    } catch (err) {
      console.error("Failed to load contexts:", err);
    } finally {
      setIsLoadingContexts(false);
    }
  }, []);

  // Fetch contexts when user authenticates
  useEffect(() => {
    if (!isAuthenticated) {
      setOrganizations([]);
      setProjects([]);
      setPermissions([]);
      setIsLoadingContexts(false);
      return;
    }

    loadContexts();
  }, [isAuthenticated, loadContexts]);

  // Fetch permissions whenever active context changes
  useEffect(() => {
    if (!isAuthenticated) {
      setPermissions([]);
      return;
    }

    // System admins can load permissions without an org context
    // Non-system-admins need an org context
    if (!activeOrgId && !user?.isSystemAdmin) {
      setPermissions([]);
      return;
    }

    async function loadPermissions() {
      try {
        const data = await apiClient<{ permissions: string[] }>(
          "/auth/me/permissions",
          { auth: true },
        );
        setPermissions(data.permissions || []);
      } catch (err) {
        console.error("Failed to load permissions:", err);
        setPermissions([]);
      }
    }

    loadPermissions();
  }, [isAuthenticated, activeOrgId, activeProjectId, user?.isSystemAdmin]);

  const setActiveOrg = useCallback((orgId: string) => {
    setActiveOrgIdState(orgId);
    saveActiveOrg(orgId);
    // Clear project when switching orgs
    setActiveProjectIdState(undefined);
    clearActiveProject();
  }, []);

  const setActiveProject = useCallback((projectId: string | undefined) => {
    setActiveProjectIdState(projectId);
    if (projectId) {
      saveActiveProject(projectId);
    } else {
      clearActiveProject();
    }
  }, []);

  const can = useCallback(
    (permission: string) => {
      if (permissions.includes(permission)) return true;
      // Wildcard matching: "ticket.*" should match "ticket.assign"
      const parts = permission.split(".");
      for (let i = parts.length - 1; i > 0; i--) {
        const wildcard = parts.slice(0, i).join(".") + ".*";
        if (permissions.includes(wildcard)) return true;
      }
      return permissions.includes("*");
    },
    [permissions],
  );

  return (
    <RBACContext.Provider
      value={{
        organizations,
        projects,
        activeOrgId,
        activeProjectId,
        permissions,
        setActiveOrg,
        setActiveProject,
        can,
        isSystemAdmin: !!user?.isSystemAdmin,
        isLoadingContexts,
        refreshContexts: loadContexts,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error("useRBAC must be used within RBACProvider");
  return ctx;
}
