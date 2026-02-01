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
  ConfirmationNumber,
  PendingActions,
  Timer,
  AssignmentTurnedIn,
} from "@mui/icons-material";

import { useManagerAnalytics } from "@/lib/hooks/useManagerAnalytics";
import KPICard from "@/app/components/dashboard/KPICard";

// Shared Charts
import D3DonutChart from "@/app/components/charts/D3DonutChart";
import D3LineChart from "@/app/components/charts/D3LineChart";
import D3BarChart from "@/app/components/charts/D3BarChart";
import D3HorizontalBarChart from "@/app/components/charts/D3HorizontalBarChart";
import D3Heatmap from "@/app/components/charts/D3Heatmap";
import PageHeader from "@/app/components/layout/PageHeader";

export default function ManagerDashboardPage() {
  const { data, loading, error } = useManagerAnalytics();
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

  // --- Prepare Data for Charts ---

  // Donut: Status Distribution
  const donutData = data
    ? [
        {
          label: "Open",
          value: data.statusSummary.open,
          color: theme.palette.error.main,
        },
        {
          label: "Assigned",
          value: data.statusSummary.assigned,
          color: theme.palette.warning.main,
        },
        {
          label: "Resolved",
          value: data.statusSummary.resolved,
          color: theme.palette.success.main,
        },
        {
          label: "Verified",
          value: data.statusSummary.verified,
          color: theme.palette.info.main,
        },
        {
          label: "Closed",
          value: data.statusSummary.closed,
          color: theme.palette.grey[500],
        },
      ]
    : [];

  // Vertical Bar: Tickets per Resolver
  const resolverData = data
    ? data.ticketsPerResolver.map((r) => ({
        label: r.resolverName,
        value: r.ticketCount,
      }))
    : [];

  // Line: Daily Tickets
  const dailyData = data
    ? data.dailyTicketTrend.map((d) => ({
        date: new Date(d.day),
        value: d.count,
      }))
    : [];

  // Horizontal Bar: Resolver Performance
  const performanceData = data
    ? data.resolverPerformance.map((r) => ({
        label: r.resolverName,
        value: r.avgResolutionDays,
      }))
    : [];

  // Heatmap: Aging
  const agingData = data ? data.agingBuckets : [];

  // KPIs
  const totalReceived = data?.statusSummary.total || 0;
  const pending = data?.statusSummary.open || 0;
  const active =
    (data?.statusSummary.assigned || 0) + (data?.statusSummary.open || 0);

  // Calculate Avg Resolution for ALL resolvers
  const allAvg = data
    ? data.resolverPerformance.reduce(
        (acc, curr) => acc + curr.avgResolutionDays,
        0,
      ) / (data.resolverPerformance.length || 1)
    : 0;

  // KPI Configuration
  const kpiStats = [
    {
      title: "Total Tickets",
      value: totalReceived,
      icon: <ConfirmationNumber fontSize="small" />,
      color: "primary.main",
    },
    {
      title: "Open Tickets",
      value: pending,
      icon: <PendingActions fontSize="small" />,
      color: "#ef4444", // Red
    },
    {
      title: "Active Workload",
      value: active,
      icon: <AssignmentTurnedIn fontSize="small" />,
      color: "#f59e0b", // Amber
    },
    {
      title: "Avg Resolution Time",
      value: `${allAvg.toFixed(1)} Days`,
      icon: <Timer fontSize="small" />,
      color: "#10b981", // Emerald
    },
  ];

  // Charts Configuration
  const charts = [
    {
      key: "daily-trend",
      size: { xs: 12, lg: 8 },
      height: 400,
      render: () => (
        <D3LineChart
          data={dailyData}
          title="Daily Ticket Creation Trend"
          height={400}
          color={theme.palette.secondary.main}
        />
      ),
    },
    {
      key: "status-dist",
      size: { xs: 12, lg: 4 },
      height: 400,
      render: () => (
        <D3DonutChart
          data={donutData}
          title="Ticket Status Distribution"
          height={400}
          width={320}
        />
      ),
    },
    {
      key: "resolver-bar",
      size: { xs: 12 },
      height: 350,
      render: () => (
        <D3BarChart
          data={resolverData}
          title="Tickets Assigned per Resolver"
          height={350}
          color={theme.palette.primary.main}
        />
      ),
    },
    {
      key: "resolver-perf",
      size: { xs: 12, md: 6 },
      height: 350,
      render: () => (
        <D3HorizontalBarChart
          data={performanceData}
          title="Resolver Performance (Avg Days)"
          height={350}
        />
      ),
    },
    {
      key: "aging-heat",
      size: { xs: 12, md: 6 },
      height: 350,
      render: () => (
        <D3Heatmap
          data={agingData}
          title="Ticket Aging Analysis"
          height={350}
        />
      ),
    },
  ];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title="Manager Dashboard"
          description="Real-time overview of team performance and ticket metrics."
        />

        <Grid container spacing={3} mb={4}>
          {/* Render KPIs */}
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

          {/* Render Charts */}
          {charts.map((chart) => (
            <Grid key={chart.key} size={chart.size}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height={chart.height}
                  sx={{ borderRadius: 3 }}
                />
              ) : (
                chart.render()
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fade>
  );
}
