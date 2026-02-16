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
  CheckCircle,
  Assignment,
  Speed,
  TrendingUp,
} from "@mui/icons-material";
import KPICard from "./KPICard";
import D3LineChart from "../charts/D3LineChart";
import D3DualLineChart from "../charts/D3DualLineChart";
import PageHeader from "../layout/PageHeader";
import { AgentAnalytics } from "@/lib/hooks/useAgentAnalytics";

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
      label: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: item.resolved,
    })) || [];

  const inflowOutflowData =
    data?.inflowOutflow.map((item) => ({
      label: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      inflow: item.inflow,
      outflow: item.outflow,
    })) || [];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title={`Welcome back, ${userName?.split(" ")[0] || "Agent"}`}
          description="Your personal productivity and resolution metrics"
        />

        <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
          <Chip
            label="Agent"
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: "#E8F5E9",
              color: "#2E7D32",
            }}
          />
          <Chip
            label="Personal Analytics"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
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

          {/* Inflow/Outflow */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DualLineChart
                data={inflowOutflowData}
                title="Your Work Queue (Last 14 Days)"
                height={400}
                line1Label="Assigned"
                line2Label="Resolved"
                line1Color="#f59e0b"
                line2Color="#10b981"
              />
            )}
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
                tickets assigned, with <strong>{productivity.inProgress}</strong>{" "}
                in progress.
              </>
            ) : (
              " Great work maintaining your queue!"
            )}
          </Typography>
        </Box>
      </Container>
    </Fade>
  );
}
