import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  Box,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  CheckCircle,
  Assignment,
  Speed,
  TrendingUp,
} from "@mui/icons-material";
import KPICard from "./KPICard";
import D3LineChart from "../charts/D3LineChart";
import D3TicketAgingHeatmap from "../charts/D3TicketAgingHeatmap";
import D3BulletChart from "../charts/D3BulletChart";
import PageHeader from "../layout/PageHeader";
import { AgentAnalytics } from "@/lib/hooks/useAgentAnalytics";
import { useRBAC } from "@/context/RBACContext";

const SkeletonCard = ({ height = 140 }: { height?: number }) => (
  <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
);

interface Props {
  data: AgentAnalytics | null;
  loading: boolean;
  error: Error | null;
  userName?: string;
}

export default function AgentDashboard({
  data,
  loading,
  error,
  userName,
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

  const productivity = data?.productivity;

  const kpis = [
    {
      title: "Resolved Today",
      value: productivity?.resolvedToday || 0,
      icon: <CheckCircle fontSize="small" />,
      color: "#10b981",
    },
    {
      title: "Resolved This Week",
      value: productivity?.resolvedThisWeek || 0,
      icon: <TrendingUp fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Currently Assigned",
      value: productivity?.assigned || 0,
      icon: <Assignment fontSize="small" />,
      color: "#f59e0b",
    },
    {
      title: "Avg Resolution Time",
      value: `${data?.resolutionTime.avgDays || 0}d`,
      icon: <Speed fontSize="small" />,
      color: "#6366f1",
    },
  ];

  const velocityData =
    data?.velocityTrend.map((item) => ({
      date: new Date(item.date),
      value: item.resolved,
    })) || [];

  const tasksDueData =
    data?.tasksDue?.map((t) => ({
      priority: t.priority,
      ageBucket: t.ageBucket,
      count: t.count,
    })) || [];

  const resolutionBulletData = [
    {
      title: "Avg Resolution",
      subtitle: "Days",
      ranges: [3, 5, 10],
      measures: [data?.resolutionTime.avgDays || 0],
      markers: [3], // Target resolution time 3 days
    },
  ];

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
            title={`Welcome back, ${userName?.split(" ")[0] || "Agent"}`}
            breadcrumbTitle="Dashboard"
            description="Your personal productivity and resolution metrics"
          />
          {projects.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Filter by Project</InputLabel>
              <Select
                value={activeProjectId || ""}
                label="Filter by Project"
                onChange={(e) => setActiveProject(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Projects</em>
                </MenuItem>
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
          Your Productivity
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
          Performance Trends
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Velocity Trend */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3LineChart
                data={velocityData}
                title="Resolution Velocity (Last 30 Days)"
                height={400}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>

          {/* Tasks Due (Heatmap) */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3TicketAgingHeatmap
                data={tasksDueData}
                title="Your Active Tasks by Priority & Age"
                height={400}
              />
            )}
          </Grid>

          {/* Performance against Target (Bullet Chart) */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Resolution Time vs SLA Target (3 Days)
              </Typography>
              {loading ? (
                <SkeletonCard height={100} />
              ) : (
                <D3BulletChart data={resolutionBulletData} height={150} />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Summary Stats */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Performance Summary
          </Typography>
          <Typography variant="body1">
            You&apos;ve resolved{" "}
            <strong>{data?.resolutionTime.resolvedCount || 0}</strong> tickets
            with an average resolution time of{" "}
            <strong>{data?.resolutionTime.avgDays || 0} days</strong>.
            {productivity?.assigned ? (
              <>
                {" "}
                You currently have <strong>{productivity.assigned}</strong>{" "}
                tickets assigned, with{" "}
                <strong>{productivity.inProgress}</strong> in progress.
              </>
            ) : (
              " "
            )}
          </Typography>
        </Box>
      </Container>
    </Fade>
  );
}
