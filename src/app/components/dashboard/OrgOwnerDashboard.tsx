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
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ConfirmationNumber,
  Folder,
  People,
  Warning,
} from "@mui/icons-material";
import KPICard from "./KPICard";
import D3HorizontalBarChart from "../charts/D3HorizontalBarChart";
import PageHeader from "../layout/PageHeader";
import { OrgOwnerAnalytics } from "@/lib/hooks/useOrgOwnerAnalytics";

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
        <PageHeader
          title="Organization Owner Dashboard"
          breadcrumbTitle="Dashboard"
          description="Organization-wide performance and insights"
        />

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
              <Card
                elevation={0}
                sx={{
                  height: 400,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ height: "100%", overflow: "auto" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Top Performers (Last 30 Days)
                  </Typography>

                  {!data?.topPerformers.length ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No data available
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Agent</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Resolved</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Avg Days</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.topPerformers.map((performer) => (
                            <TableRow key={performer.userId}>
                              <TableCell>{performer.userName}</TableCell>
                              <TableCell align="right">
                                {performer.ticketsResolved}
                              </TableCell>
                              <TableCell align="right">
                                {performer.avgResolutionDays}d
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Bottleneck Analysis */}
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <SkeletonCard height={350} />
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Bottleneck Analysis
                  </Typography>

                  {!data?.bottleneckAnalysis.length ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No bottlenecks detected - all tickets are progressing
                        well!
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Project</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Stale Tickets (7+ days)</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Unassigned</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Avg Open Age</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.bottleneckAnalysis.map((project) => (
                            <TableRow key={project.projectId}>
                              <TableCell>{project.projectName}</TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={project.staleTickets}
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      project.staleTickets > 5
                                        ? "#fee2e2"
                                        : "#fef3c7",
                                    color:
                                      project.staleTickets > 5
                                        ? "#991b1b"
                                        : "#92400e",
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {project.unassignedTickets}
                              </TableCell>
                              <TableCell align="right">
                                {project.avgOpenAge}d
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
