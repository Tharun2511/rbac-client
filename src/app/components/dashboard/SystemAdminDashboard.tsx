import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
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
import KPICard from "./KPICard";
import D3DonutChart from "../charts/D3DonutChart";
import D3HorizontalBarChart from "../charts/D3HorizontalBarChart";
import D3LineChart from "../charts/D3LineChart";
import PageHeader from "../layout/PageHeader";
import { SystemAdminAnalytics } from "@/lib/hooks/useSystemAdminDashboard";

const SkeletonCard = ({ height = 140 }: { height?: number }) => (
  <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
);

interface Props {
  data: SystemAdminAnalytics | null;
  loading: boolean;
  error: Error | null;
  userName?: string;
}

export default function SystemAdminDashboard({
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

  const stats = data?.stats;
  const systemKpis = [
    {
      title: "Total Organizations",
      value: stats?.totalOrgs || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <PendingActions fontSize="small" />,
      color: "#6366f1",
    },
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: <CheckCircle fontSize="small" />,
      color: "#10b981",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: <TrendingUp fontSize="small" />,
      color: "#22c55e",
    },
  ];

  const memberDistributionData =
    data?.memberDistribution.slice(0, 10).map((org) => ({
      label: org.name,
      value: org.memberCount,
      color: theme.palette.primary.main,
    })) || [];

  const roleDistributionData =
    data?.roleDistribution.map((role) => ({
      label: role.role.replace(/_/g, " "),
      value: role.count,
      color:
        role.role === "SYSTEM_ADMIN"
          ? "#ef4444"
          : role.role === "ORG_OWNER"
            ? "#f59e0b"
            : role.role === "ORG_ADMIN"
              ? "#3b82f6"
              : role.role === "PROJECT_MANAGER"
                ? "#8b5cf6"
                : role.role === "AGENT"
                  ? "#10b981"
                  : "#6b7280",
    })) || [];

  const orgTimelineData =
    data?.orgTimeline.map((item) => ({
      date: new Date(item.date),
      value: item.count,
    })) || [];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title={`Welcome back, ${userName?.split(" ")[0] || "Admin"}`}
          breadcrumbTitle="Dashboard"
          description="System-wide organization and user management overview"
        />

        {/* System Stats KPIs */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
          Platform Statistics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {systemKpis.map((kpi, i) => (
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

          {/* User Status Card */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <SkeletonCard />
            ) : (
              <KPICard
                title="Inactive Users"
                value={stats?.inactiveUsers || 0}
                icon={<Archive fontSize="small" />}
                color="#64748b"
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Charts Section */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Analytics & Insights
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Member Distribution by Organization */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3HorizontalBarChart
                data={memberDistributionData}
                title="Top Organizations by Members"
                height={400}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>

          {/* Role Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DonutChart
                data={roleDistributionData}
                title="User Role Distribution"
                height={400}
                width={320}
              />
            )}
          </Grid>

          {/* Organization Creation Timeline */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <SkeletonCard height={350} />
            ) : (
              <D3LineChart
                data={orgTimelineData}
                title="Organization Creation Timeline (Last 30 Days)"
                height={350}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
