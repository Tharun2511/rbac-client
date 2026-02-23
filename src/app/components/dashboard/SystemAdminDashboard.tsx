import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  useTheme,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import D3AreaChart from "../charts/D3AreaChart";
import PageHeader from "../layout/PageHeader";
import { SystemAdminAnalytics } from "@/lib/hooks/useSystemAdminDashboard";
import { useOrgOwnerAnalytics } from "@/lib/hooks/useOrgOwnerAnalytics";
import * as d3 from "d3";

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
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const { data: orgData, loading: orgLoading } = useOrgOwnerAnalytics(
    selectedOrgId || undefined,
  );

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

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  const roleDistributionData =
    data?.roleDistribution.map((role) => {
      return {
        label: role.role.replace(/_/g, " "),
        value: role.count,
        color: colorScale(role.role),
      };
    }) || [];

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
              <D3AreaChart
                data={orgTimelineData}
                title="Organization Creation Timeline (Last 30 Days)"
                height={350}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Organization Specific Insights */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Organization Insights
          </Typography>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Select Organization</InputLabel>
            <Select
              value={selectedOrgId}
              label="Select Organization"
              onChange={(e) => setSelectedOrgId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data?.memberDistribution.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {selectedOrgId && (
          <Fade in timeout={500}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                {orgLoading ? (
                  <SkeletonCard height={350} />
                ) : (
                  <D3DonutChart
                    data={
                      orgData?.slaCompliance?.map((s) => ({
                        label: s.slaStatus,
                        value: s.count,
                        color: s.slaStatus.includes("<")
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      })) || []
                    }
                    title="SLA Compliance"
                    height={350}
                    width={320}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {orgLoading ? (
                  <SkeletonCard height={350} />
                ) : (
                  <D3HorizontalBarChart
                    data={
                      orgData?.resourceAllocation?.map((r) => ({
                        label: r.projectName,
                        value: r.agentCount,
                        color: theme.palette.primary.main,
                      })) || []
                    }
                    title="Project Resource Allocation (Agents)"
                    height={350}
                  />
                )}
              </Grid>
            </Grid>
          </Fade>
        )}
      </Container>
    </Fade>
  );
}
