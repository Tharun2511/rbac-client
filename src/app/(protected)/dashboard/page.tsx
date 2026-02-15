"use client";

import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  Box,
  Chip,
  useTheme,
  Divider,
} from "@mui/material";
import {
  ConfirmationNumber,
  PendingActions,
  CheckCircle,
  Archive,
  TrendingUp,
} from "@mui/icons-material";

import { useDashboardAnalytics } from "@/lib/hooks/useDashboardAnalytics";
import { useAuth } from "@/context/AuthContext";
import { useRBAC } from "@/context/RBACContext";
import KPICard from "@/app/components/dashboard/KPICard";
import D3DonutChart from "@/app/components/charts/D3DonutChart";
import D3BarChart from "@/app/components/charts/D3BarChart";
import PageHeader from "@/app/components/layout/PageHeader";

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
  CLOSED: "#64748b",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#10b981",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#dc2626",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeOrgId, isSystemAdmin, organizations } = useRBAC();
  const { orgData, myData, loading, error, canViewOrg } =
    useDashboardAnalytics();
  const theme = useTheme();

  const activeOrg = organizations.find((o) => o.id === activeOrgId);

  // Only show the "select org" prompt for non-system-admin users with no org
  if (!activeOrgId && !isSystemAdmin) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageHeader
          title="Dashboard"
          description="Select an organization from the sidebar to view analytics."
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading dashboard: {error.message}
        </Typography>
      </Container>
    );
  }

  // --- My Stats ---
  const myStats = myData?.stats;
  const myKpis = [
    {
      title: "My Total Tickets",
      value: myStats?.totalTickets || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: "primary.main",
    },
    {
      title: "My Open",
      value: myStats?.openTickets || 0,
      icon: <PendingActions fontSize="small" />,
      color: "#f59e0b",
    },
    {
      title: "My Resolved",
      value: myStats?.resolvedTickets || 0,
      icon: <CheckCircle fontSize="small" />,
      color: "#10b981",
    },
    {
      title: "My Closed",
      value: myStats?.closedTickets || 0,
      icon: <Archive fontSize="small" />,
      color: "#64748b",
    },
  ];

  // --- Org / System Stats ---
  const orgStats = orgData?.stats;
  const orgKpis = [
    {
      title: "Total Tickets",
      value: orgStats?.totalTickets || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Open",
      value: orgStats?.openTickets || 0,
      icon: <PendingActions fontSize="small" />,
      color: "#ef4444",
    },
    {
      title: "In Progress",
      value: orgStats?.inProgressTickets || 0,
      icon: <TrendingUp fontSize="small" />,
      color: "#f59e0b",
    },
    {
      title: "Resolved",
      value: orgStats?.resolvedTickets || 0,
      icon: <CheckCircle fontSize="small" />,
      color: "#10b981",
    },
  ];

  // --- Chart Data ---
  const statusDonut =
    orgData?.byStatus.map((s) => ({
      label: s.status,
      value: s.count,
      color: STATUS_COLORS[s.status] || theme.palette.grey[500],
    })) || [];

  const priorityBar =
    orgData?.byPriority.map((p) => ({
      label: p.priority,
      value: p.count,
      color: PRIORITY_COLORS[p.priority] || theme.palette.grey[500],
    })) || [];

  const myStatusDonut = myStats
    ? [
        {
          label: "Open",
          value: myStats.openTickets,
          color: STATUS_COLORS.OPEN,
        },
        {
          label: "In Progress",
          value: myStats.inProgressTickets,
          color: STATUS_COLORS.IN_PROGRESS,
        },
        {
          label: "Resolved",
          value: myStats.resolvedTickets,
          color: STATUS_COLORS.RESOLVED,
        },
        {
          label: "Closed",
          value: myStats.closedTickets,
          color: STATUS_COLORS.CLOSED,
        },
      ].filter((d) => d.value > 0)
    : [];

  const SkeletonCard = ({ height = 140 }: { height?: number }) => (
    <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
  );

  // For system admin: show "System-Wide" label instead of org name
  const analyticsLabel =
    isSystemAdmin && !activeOrg
      ? "System-Wide"
      : activeOrg?.name || "Organization";

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
          description={
            isSystemAdmin && !activeOrg
              ? "Viewing system-wide analytics across all organizations"
              : activeOrg
                ? `Viewing analytics for ${activeOrg.name}`
                : "Your dashboard overview"
          }
        />

        {/* Badges */}
        <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
          {isSystemAdmin && (
            <Chip
              label="System Admin"
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: "#FFF3E0",
                color: "#E65100",
              }}
            />
          )}
          {canViewOrg && (
            <Chip
              label={
                isSystemAdmin && !activeOrg
                  ? "System-Wide Analytics"
                  : "Org Analytics"
              }
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {/* --- My Analytics Section (only if user has personal data) --- */}
        {myData && (
          <>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ mt: 1 }}
            >
              My Activity
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {myKpis.map((kpi, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  {loading ? (
                    <SkeletonCard />
                  ) : (
                    <KPICard
                      title={kpi.title}
                      value={kpi.value}
                      icon={kpi.icon}
                      color={kpi.color}
                    />
                  )}
                </Grid>
              ))}

              <Grid size={{ xs: 12, md: 6 }}>
                {loading ? (
                  <SkeletonCard height={350} />
                ) : (
                  <D3DonutChart
                    data={myStatusDonut}
                    title="My Ticket Status"
                    height={350}
                    width={320}
                  />
                )}
              </Grid>
            </Grid>
          </>
        )}

        {/* --- Org / System Analytics Section (Permission-gated) --- */}
        {canViewOrg && (
          <>
            {myData && <Divider sx={{ my: 3 }} />}
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {isSystemAdmin && !activeOrg
                ? "System Overview"
                : "Organization Overview"}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                — {analyticsLabel}
              </Typography>
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {orgKpis.map((kpi, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  {loading ? (
                    <SkeletonCard />
                  ) : (
                    <KPICard
                      title={kpi.title}
                      value={kpi.value}
                      icon={kpi.icon}
                      color={kpi.color}
                    />
                  )}
                </Grid>
              ))}

              <Grid size={{ xs: 12, md: 6 }}>
                {loading ? (
                  <SkeletonCard height={400} />
                ) : (
                  <D3DonutChart
                    data={statusDonut}
                    title="Tickets by Status"
                    height={400}
                    width={320}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {loading ? (
                  <SkeletonCard height={400} />
                ) : (
                  <D3BarChart
                    data={priorityBar}
                    title="Tickets by Priority"
                    height={400}
                    color={theme.palette.primary.main}
                  />
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Fade>
  );
}
