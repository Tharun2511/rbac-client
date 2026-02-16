"use client";

import { Container } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRBAC } from "@/context/RBACContext";
import { useSystemAdminDashboard } from "@/lib/hooks/useSystemAdminDashboard";
import { useOrgOwnerAnalytics } from "@/lib/hooks/useOrgOwnerAnalytics";
import { useProjectManagerAnalytics } from "@/lib/hooks/useProjectManagerAnalytics";
import { useAgentAnalytics } from "@/lib/hooks/useAgentAnalytics";
import { useRequesterAnalytics } from "@/lib/hooks/useRequesterAnalytics";
import SystemAdminDashboard from "@/app/components/dashboard/SystemAdminDashboard";
import OrgOwnerDashboard from "@/app/components/dashboard/OrgOwnerDashboard";
import ProjectManagerDashboard from "@/app/components/dashboard/ProjectManagerDashboard";
import AgentDashboard from "@/app/components/dashboard/AgentDashboard";
import RequesterDashboard from "@/app/components/dashboard/RequesterDashboard";
import PageHeader from "@/app/components/layout/PageHeader";

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeOrgId, activeProjectId, isSystemAdmin, can } = useRBAC();

  // Determine role hierarchy (show highest privilege view)
  const isOrgOwner = can("analytics.view.org") && !isSystemAdmin;
  const isProjectManager =
    can("analytics.view.project") && !isOrgOwner && !isSystemAdmin;
  const isAgent =
    can("ticket.resolve") &&
    !isProjectManager &&
    !isOrgOwner &&
    !isSystemAdmin;

  // Fetch appropriate data based on role
  const systemAdminData = useSystemAdminDashboard();
  const orgOwnerData = useOrgOwnerAnalytics(
    isOrgOwner ? activeOrgId : undefined
  );
  const projectManagerData = useProjectManagerAnalytics(
    isProjectManager ? activeProjectId : undefined
  );
  const agentData = useAgentAnalytics(isAgent ? activeOrgId : undefined);
  const requesterData = useRequesterAnalytics(
    !isAgent && !isProjectManager && !isOrgOwner && !isSystemAdmin
      ? activeOrgId
      : undefined
  );

  // System Admin Dashboard
  if (isSystemAdmin) {
    return (
      <SystemAdminDashboard
        data={systemAdminData.data}
        loading={systemAdminData.loading}
        error={systemAdminData.error}
        userName={user?.name}
      />
    );
  }

  // Org Owner Dashboard
  if (isOrgOwner && activeOrgId) {
    return (
      <OrgOwnerDashboard
        data={orgOwnerData.data}
        loading={orgOwnerData.loading}
        error={orgOwnerData.error}
      />
    );
  }

  // Project Manager Dashboard
  if (isProjectManager && activeProjectId) {
    return (
      <ProjectManagerDashboard
        data={projectManagerData.data}
        loading={projectManagerData.loading}
        error={projectManagerData.error}
      />
    );
  }

  // Agent Dashboard
  if (isAgent && activeOrgId) {
    return (
      <AgentDashboard
        data={agentData.data}
        loading={agentData.loading}
        error={agentData.error}
        userName={user?.name}
      />
    );
  }

  // Requester Dashboard (default for users without special permissions)
  if (activeOrgId) {
    return (
      <RequesterDashboard
        data={requesterData.data}
        loading={requesterData.loading}
        error={requesterData.error}
        userName={user?.name}
      />
    );
  }

  // No org selected - prompt user
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Dashboard"
        description="Select an organization from the sidebar to view analytics."
      />
    </Container>
  );
}
