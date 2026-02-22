import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
  Box,
  useTheme,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ConfirmationNumber,
  PendingActions,
  CheckCircle,
  Speed,
} from "@mui/icons-material";
import KPICard from "./KPICard";
import D3DonutChart from "../charts/D3DonutChart";
import PageHeader from "../layout/PageHeader";
import { RequesterAnalytics } from "@/lib/hooks/useRequesterAnalytics";
import { formatDistanceToNow } from "date-fns";

const SkeletonCard = ({ height = 140 }: { height?: number }) => (
  <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />
);

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
  CLOSED: "#64748b",
};

interface Props {
  data: RequesterAnalytics | null;
  loading: boolean;
  error: Error | null;
  userName?: string;
}

export default function RequesterDashboard({
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
  const turnaround = data?.turnaroundTime;

  const kpis = [
    {
      title: "My Total Tickets",
      value: stats?.totalTickets || 0,
      icon: <ConfirmationNumber fontSize="small" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Open / In Progress",
      value: (stats?.openTickets || 0) + (stats?.inProgressTickets || 0),
      icon: <PendingActions fontSize="small" />,
      color: "#f59e0b",
    },
    {
      title: "Completed",
      value: turnaround?.completedTickets || 0,
      icon: <CheckCircle fontSize="small" />,
      color: "#10b981",
    },
    {
      title: "Avg Turnaround",
      value: `${turnaround?.avgTurnaroundDays || 0}d`,
      icon: <Speed fontSize="small" />,
      color: "#6366f1",
    },
  ];

  const statusData = stats
    ? [
        {
          label: "Open",
          value: stats.openTickets,
          color: STATUS_COLORS.OPEN,
        },
        {
          label: "In Progress",
          value: stats.inProgressTickets,
          color: STATUS_COLORS.IN_PROGRESS,
        },
        {
          label: "Resolved",
          value: stats.resolvedTickets,
          color: STATUS_COLORS.RESOLVED,
        },
        {
          label: "Closed",
          value: stats.closedTickets,
          color: STATUS_COLORS.CLOSED,
        },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <PageHeader
          title={`Welcome back, ${userName?.split(" ")[0] || "User"}`}
          breadcrumbTitle="Dashboard"
          description="Track your tickets and recent activity"
        />

        {/* KPIs */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
          My Ticket Overview
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

        {/* Content Section */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Ticket Status & Activity
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Status Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <SkeletonCard height={400} />
            ) : (
              <D3DonutChart
                data={statusData}
                title="My Ticket Status Distribution"
                height={400}
                width={320}
              />
            )}
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                    Recent Activity
                  </Typography>

                  {!data?.recentActivity.length ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No recent activity
                      </Typography>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {data.recentActivity.map((activity) => (
                        <ListItem
                          key={activity.id}
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={600}>
                                {activity.ticketTitle}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {activity.performedByName} •{" "}
                                  {activity.type.replace(/_/g, " ")} •{" "}
                                  {formatDistanceToNow(
                                    new Date(activity.createdAt),
                                    { addSuffix: true },
                                  )}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Summary */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1">
            You have created <strong>{stats?.totalTickets || 0}</strong> tickets
            in total.
            {turnaround?.completedTickets ? (
              <>
                {" "}
                <strong>{turnaround.completedTickets}</strong> have been
                completed with an average turnaround time of{" "}
                <strong>{turnaround.avgTurnaroundDays} days</strong>.
              </>
            ) : null}
            {stats && stats.openTickets + stats.inProgressTickets > 0 ? (
              <>
                {" "}
                You currently have{" "}
                <strong>
                  {stats.openTickets + stats.inProgressTickets}
                </strong>{" "}
                active tickets.
              </>
            ) : null}
          </Typography>
        </Box>
      </Container>
    </Fade>
  );
}
