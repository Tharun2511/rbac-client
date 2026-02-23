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
  ConfirmationNumber,
  Folder,
  People,
  Warning,
} from "@mui/icons-material";
import KPICard from "./KPICard";
import D3HorizontalBarChart from "../charts/D3HorizontalBarChart";
import D3ScatterPlot from "../charts/D3ScatterPlot";
import PageHeader from "../layout/PageHeader";
import { OrgOwnerAnalytics } from "@/lib/hooks/useOrgOwnerAnalytics";
import { useRBAC } from "@/context/RBACContext";

const SkeletonCard = ({ height = 140 }: { height?: number }) => (
  <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
);

interface Props {
  data: OrgOwnerAnalytics | null;
  loading: boolean;
  error: Error | null;
}

export default function OrgOwnerDashboard({ data, loading, error }: Props) {
  const theme = useTheme();
  const { organizations, activeOrgId, setActiveOrg, isSystemAdmin } = useRBAC();

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading dashboard: {error.message}
        </Typography>
      </Container>
    );
  }

  const stats = data?.orgStats;
  const totalStaleTickets =
    data?.bottleneckAnalysis.reduce(
      (sum, project) => sum + project.staleTickets,
      0,
    ) || 0;

  const kpis = [
    {
      title: "Total Tickets",
      value: stats?.totalTickets || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Active Projects",
      value: data?.crossProjectPerformance.length || 0,
      icon: <Folder fontSize="small" />,
      color: "#6366f1",
    },
    {
      title: "Active Agents",
      value:
        data?.crossProjectPerformance.reduce(
          (sum, p) => sum + p.activeAgents,
          0,
        ) || 0,
      icon: <People fontSize="small" />,
      color: "#10b981",
    },
    {
      title: "Stale Tickets",
      value: totalStaleTickets,
      icon: <Warning fontSize="small" />,
      color: "#ef4444",
    },
  ];

  const projectPerformanceData =
    data?.crossProjectPerformance.slice(0, 10).map((project) => ({
      label: project.projectName,
      value: project.totalTickets,
      color: theme.palette.primary.main,
    })) || [];

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
            title="Organization Owner Dashboard"
            breadcrumbTitle="Dashboard"
            description="Organization-wide performance and insights"
          />
          {organizations.length > 0 && !isSystemAdmin && (
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={activeOrgId || ""}
                label="Select Organization"
                onChange={(e) => setActiveOrg(e.target.value)}
              >
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* KPIs */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
          Organization Overview
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

        {/* Charts & Tables */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Performance & Bottlenecks
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Project Performance */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3HorizontalBarChart
                data={projectPerformanceData}
                title="Projects by Total Tickets"
                height={400}
                color={theme.palette.primary.main}
              />
            )}
          </Grid>

          {/* Top Performers */}
          <Grid size={{ xs: 12, lg: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3HorizontalBarChart
                data={
                  data?.topPerformers.slice(0, 10).map((performer) => ({
                    label: performer.userName,
                    value: performer.ticketsResolved,
                    color: "#10b981",
                  })) || []
                }
                title="Top Performers (Resolved Tickets)"
                height={400}
                color="#10b981"
              />
            )}
          </Grid>

          {/* Bottleneck Analysis */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3ScatterPlot
                data={
                  data?.bottleneckAnalysis.map((b) => ({
                    id: b.projectId,
                    label: b.projectName,
                    x: b.avgOpenAge,
                    y: b.staleTickets,
                    z: b.unassignedTickets + 1,
                  })) || []
                }
                title="Project Bottleneck Analysis"
                xLabel="Average Open Age (Days)"
                yLabel="Stale Tickets (7+ Days)"
                height={400}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
