"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Fade,
} from "@mui/material";
import { ConfirmationNumber, PendingActions, Timer } from "@mui/icons-material";

import { useUserAnalytics } from "@/lib/hooks/useUserAnalytics";
import KPICard from "@/app/components/dashboard/KPICard";
import D3DonutChart from "@/app/components/charts/D3DonutChart";
import TicketList from "@/app/components/tickets/TicketList";
import PageHeader from "@/app/components/layout/PageHeader";
import D3LineChart from "@/app/components/charts/D3LineChart";

export default function UserDashboardPage() {
  const { data, loading, error } = useUserAnalytics();

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading dashboard: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="User Analytics"
        description="Overview of your ticket activity and performance metrics."
      />

      <Grid container spacing={3} mb={4}>
        {/* KPI Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading || !data ? (
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 3 }}
            />
          ) : (
            <KPICard
              title="Total Tickets"
              value={data.totalTickets}
              icon={<ConfirmationNumber fontSize="small" />}
              color="primary.main"
              // trend={{ value: 12, isPositive: true }}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading || !data ? (
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 3 }}
            />
          ) : (
            <KPICard
              title="Open Tickets"
              value={data.openTickets}
              icon={<PendingActions fontSize="small" />}
              color="#f59e0b" // Amber
              // trend={{ value: 5, isPositive: false }}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading || !data ? (
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 3 }}
            />
          ) : (
            <KPICard
              title="Avg Resolution Time"
              value={data.avgResolutionTime}
              icon={<Timer fontSize="small" />}
              color="#10b981" // Emerald
              // trend={{ value: 8, isPositive: true }}
            />
          )}
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          {loading || !data ? (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          ) : (
            <D3DonutChart
              data={data.ticketStatusData}
              title="Ticket Status Breakdown"
              height={350}
              width={350}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {loading || !data ? (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          ) : (
            <D3LineChart
              data={data.ticketsOverTime.map((d) => ({
                date: new Date(d.date),
                value: d.value,
              }))}
              title="Tickets Created Over Time"
              height={350}
            />
          )}
        </Grid>

        {/* Recent Tickets */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Recent Tickets
            </Typography>
            <TicketList
              tickets={data ? data.recentTickets : []}
              loading={loading}
              error={error ? (error as Error).message : undefined}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
