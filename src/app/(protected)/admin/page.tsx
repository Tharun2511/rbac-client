"use client";

import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Group,
  PersonOff,
  Person,
  ConfirmationNumber,
} from "@mui/icons-material";

import { useAdminAnalytics } from "@/lib/hooks/useAdminAnalytics";
import KPICard from "@/app/components/dashboard/KPICard";

// Shared Charts
import D3DonutChart from "@/app/components/charts/D3DonutChart";
import D3LineChart from "@/app/components/charts/D3LineChart";
import D3MatrixHeatmap from "@/app/components/charts/D3MatrixHeatmap";
import PageHeader from "@/app/components/layout/PageHeader";

export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminAnalytics();
  const theme = useTheme();

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading dashboard: {error.message}
        </Typography>
      </Container>
    );
  }

  // --- Data Prep ---

  // Donut: Roles
  const roleColors: Record<string, string> = {
    USER: theme.palette.info.main,
    MANAGER: theme.palette.warning.main,
    RESOLVER: theme.palette.success.main,
    ADMIN: theme.palette.error.main,
  };

  const roleData =
    data?.usersByRole.map((r) => ({
      label: r.role,
      value: r.count,
      color: roleColors[r.role] || theme.palette.grey[500],
    })) || [];

  // Pie (Donut): Active vs Inactive
  const activeData = data
    ? [
        {
          label: "Active",
          value: data.activeUsers.active,
          color: theme.palette.success.light,
        },
        {
          label: "Inactive",
          value: data.activeUsers.inactive,
          color: theme.palette.grey[400],
        },
      ]
    : [];

  // Line: Signups
  const signupData =
    data?.signups.map((s) => ({
      date: new Date(s.day),
      value: s.count,
    })) || [];

  // Heatmap
  const activityData = data?.systemActivityHeatmap || [];

  // KPI
  const totalUsers =
    (data?.activeUsers.active || 0) + (data?.activeUsers.inactive || 0);

  // Configuration
  const kpiStats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Group fontSize="small" />,
      color: "primary.main",
    },
    {
      title: "Active Users",
      value: data?.activeUsers.active || 0,
      icon: <Person fontSize="small" />,
      color: theme.palette.success.main,
    },
    {
      title: "Inactive Users",
      value: data?.activeUsers.inactive || 0,
      icon: <PersonOff fontSize="small" />,
      color: theme.palette.grey[500],
    },
    {
      title: "Total Tickets",
      value: data?.ticketSummary.totalTickets || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title="Admin Dashboard"
          description="System-wide analytics, user metrics, and platform usage trends."
        />

        <Grid container spacing={3} mb={4}>
          {/* KPIs */}
          {kpiStats.map((kpi, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height={140}
                  sx={{ borderRadius: 3 }}
                />
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

          {/* Row 2: Charts (Roles Donut | Active Pie) */}
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3DonutChart
                data={roleData}
                title="User Distribution by Role"
                height={400}
                width={320}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3DonutChart
                data={activeData}
                title="Active vs Inactive Users"
                height={400}
                width={320}
              />
            )}
          </Grid>

          {/* Row 3: Signups Trend */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3LineChart
                data={signupData}
                title="Daily User Signups"
                height={400}
                color={theme.palette.info.main}
              />
            )}
          </Grid>

          {/* Row 4: Heatmap */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3MatrixHeatmap
                data={activityData}
                title="System Activity Heatmap"
                height={400}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
