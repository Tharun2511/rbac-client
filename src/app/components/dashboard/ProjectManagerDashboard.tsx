import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  useTheme,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Groups, Assignment, Speed } from "@mui/icons-material";
import KPICard from "./KPICard";
import D3HorizontalBarChart from "../charts/D3HorizontalBarChart";
import D3DonutChart from "../charts/D3DonutChart";
import D3RadarChart from "../charts/D3RadarChart";
import PageHeader from "../layout/PageHeader";
import { ProjectManagerAnalytics } from "@/lib/hooks/useProjectManagerAnalytics";
import { useRBAC } from "@/context/RBACContext";

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
  const { projects, activeProjectId, setActiveProject } = useRBAC();

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

  const categoryData =
    data?.typeDistribution.map((t) => ({
      label: t.label,
      value: t.value,
      color: theme.palette.secondary.main,
    })) || [];

  const radarData = data?.workloadDistribution.length
    ? [
        {
          name: "Assigned Workload",
          color: theme.palette.primary.main,
          items: data.workloadDistribution.map((w) => ({
            axis: w.agentName,
            value: w.assigned,
          })),
        },
        {
          name: "In Progress",
          color: "#f59e0b",
          items: data.workloadDistribution.map((w) => ({
            axis: w.agentName,
            value: w.inProgress,
          })),
        },
      ]
    : [];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <PageHeader
            title="Project Manager Dashboard"
            breadcrumbTitle="Dashboard"
            description="Team performance and workload management"
          />
          {projects.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={activeProjectId || ""}
                label="Select Project"
                onChange={(e) => setActiveProject(e.target.value)}
              >
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

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
            ) : radarData.length > 0 && radarData[0].items.length > 2 ? (
              <D3RadarChart
                data={radarData}
                title="Team Capacity & Workload"
                height={400}
              />
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

          {/* Category Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DonutChart
                data={categoryData}
                title="Ticket Category Distribution"
                height={400}
                width={320}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
