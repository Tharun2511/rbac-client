import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  useTheme,
  Divider,
} from "@mui/material";
import { Groups, Assignment, Speed } from "@mui/icons-material";
import KPICard from "./KPICard";
import D3HorizontalBarChart from "../charts/D3HorizontalBarChart";
import D3DonutChart from "../charts/D3DonutChart";
import D3DualLineChart from "../charts/D3DualLineChart";
import PageHeader from "../layout/PageHeader";
import { ProjectManagerAnalytics } from "@/lib/hooks/useProjectManagerAnalytics";

const SkeletonCard = ({ height = 140 }: { height?: number }) => (
  <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
);

const AGE_COLORS: Record<string, string> = {
  "0-2 days": "#10b981",
  "3-7 days": "#f59e0b",
  "7+ days": "#ef4444",
};

interface Props {
  data: ProjectManagerAnalytics | null;
  loading: boolean;
  error: Error | null;
}

export default function ProjectManagerDashboard({
  data,
  loading,
  error,
}: Props) {
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

  // Calculate KPIs
  const totalResolved =
    data?.teamPerformance.reduce((sum, agent) => sum + agent.resolved, 0) || 0;
  const activeAgents = data?.teamPerformance.length || 0;
  const totalInProgress =
    data?.workloadDistribution.reduce(
      (sum, agent) => sum + agent.inProgress,
      0,
    ) || 0;
  const avgResolutionTime = data?.teamPerformance.length
    ? (
        data.teamPerformance.reduce(
          (sum, agent) => sum + (agent.avgResolutionDays || 0),
          0,
        ) / data.teamPerformance.length
      ).toFixed(1)
    : "0";

  const kpis = [
    {
      title: "Team Resolved",
      value: totalResolved,
      icon: <Groups fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Active Agents",
      value: activeAgents,
      icon: <Groups fontSize="small" />,
      color: "#6366f1",
    },
    {
      title: "In Progress",
      value: totalInProgress,
      icon: <Assignment fontSize="small" />,
      color: "#f59e0b",
    },
    {
      title: "Avg Resolution Time",
      value: `${avgResolutionTime}d`,
      icon: <Speed fontSize="small" />,
      color: "#10b981",
    },
  ];

  // Chart data
  const teamPerformanceData =
    data?.teamPerformance.slice(0, 10).map((agent) => ({
      label: agent.agentName,
      value: agent.resolved,
      color: theme.palette.primary.main,
    })) || [];

  const workloadData =
    data?.workloadDistribution.slice(0, 10).map((agent) => ({
      label: agent.agentName,
      value: agent.total,
      color: "#f59e0b",
    })) || [];

  const agingData =
    data?.agingBuckets.map((bucket) => ({
      label: bucket.ageBucket,
      value: bucket.count,
      color: AGE_COLORS[bucket.ageBucket] || theme.palette.grey[500],
    })) || [];

  const inflowOutflowData =
    data?.inflowOutflow.map((item) => ({
      date: new Date(item.date),
      value1: item.inflow,
      value2: item.outflow,
    })) || [];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title="Project Manager Dashboard"
          breadcrumbTitle="Dashboard"
          description="Team performance and workload management"
        />

        {/* KPIs */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
          Team Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpis.map((kpi, i) => (
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
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Charts */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Performance & Workload
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Team Performance */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3HorizontalBarChart
                data={teamPerformanceData}
                title="Top Performers (Resolved Tickets)"
                height={400}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>

          {/* Workload Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3HorizontalBarChart
                data={workloadData}
                title="Current Workload Distribution"
                height={400}
                color="#f59e0b"
              />
            )}
          </Grid>

          {/* Ticket Aging */}
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DonutChart
                data={agingData}
                title="Open Ticket Age Distribution"
                height={400}
                width={320}
              />
            )}
          </Grid>

          {/* Inflow/Outflow */}
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DualLineChart
                data={inflowOutflowData}
                title="Ticket Inflow vs Outflow (Last 30 Days)"
                height={400}
                label1="Created"
                label2="Resolved"
                color1={theme.palette.primary.main}
                color2="#10b981"
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
