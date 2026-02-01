"use client";

import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  useTheme,
} from "@mui/material";
import { Assignment, Pending, CheckCircle, Timer } from "@mui/icons-material";

import { useResolverAnalytics } from "@/lib/hooks/useResolverAnalytics";
import KPICard from "@/app/components/dashboard/KPICard";

// Charts
import D3BarChart from "@/app/components/charts/D3BarChart";
import D3LineChart from "@/app/components/charts/D3LineChart";
import D3DualLineChart from "@/app/components/charts/D3DualLineChart";
import PageHeader from "@/app/components/layout/PageHeader";

export default function ResolverDashboardPage() {
  const { data, loading, error } = useResolverAnalytics();
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

  // Workload Bar
  const workloadData = data
    ? [
        { label: "Assigned", value: data.workload.assigned },
        { label: "In Progress", value: data.workload.inProgress },
        { label: "Resolved", value: data.workload.resolvedToday },
      ]
    : [];

  // Resolution Trend
  const trendData = data
    ? data.resolutionTrend.map((d) => ({
        date: new Date(d.day),
        value: d.resolved,
      }))
    : [];

  // Inflow Outflow
  const dualData = data
    ? data.inflowOutflow.map((d) => ({
        date: new Date(d.day),
        value1: d.inflow,
        value2: d.outflow,
      }))
    : [];

  // KPI Config
  const kpiStats = [
    {
      title: "Assigned Tickets",
      value: data?.workload.assigned || 0,
      icon: <Assignment fontSize="small" />,
      color: theme.palette.info.main,
    },
    {
      title: "In Progress",
      value: data?.workload.inProgress || 0,
      icon: <Pending fontSize="small" />,
      color: theme.palette.warning.main,
    },
    {
      title: "Resolved Today",
      value: data?.workload.resolvedToday || 0,
      icon: <CheckCircle fontSize="small" />,
      color: theme.palette.success.main,
    },
    {
      title: "Avg Resolution Days",
      value: data?.avgResolutionDays.toFixed(2) || 0,
      icon: <Timer fontSize="small" />,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title="Resolver Dashboard"
          description="Manage your tickets and track your resolution performance."
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

          {/* Row 2: Workload (Bar) | Trend (Line) */}
          <Grid size={{ xs: 12, md: 4 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={350}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3BarChart
                data={workloadData}
                title="Current Workload"
                height={350}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={350}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3LineChart
                data={trendData}
                title="Resolution Trend"
                height={350}
                color={theme.palette.success.main}
              />
            )}
          </Grid>

          {/* Row 3: Inflow/Outflow (Dual Line) */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            ) : (
              <D3DualLineChart
                data={dualData}
                title="Traffic Analysis (Inflow vs Outflow)"
                height={400}
                label1="New Tickets (Inflow)"
                label2="Resolved (Outflow)"
                color1={theme.palette.error.light}
                color2={theme.palette.success.light}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
