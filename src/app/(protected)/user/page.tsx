"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useUserDashboard from "@/hooks/dashboards/useUserDashboard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import StatCard from "@/app/components/dashboard/StatsCard";
import QuickActionCard from "@/app/components/dashboard/QuickActionCard";

export default function UserDashboard() {
  const router = useRouter();
  const {
    TicketsClosed,
    loading,
    ticketsToBeAssigned,
    ticketsToBeVerified,
    totalTickets,
  } = useUserDashboard();

  if (loading) return <LoadingState label="Loading User stats..." />;

  return (
    <>
      <PageHeader title="User Dashboard" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="My Tickets" value={totalTickets} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Tickets to be Verified"
            value={ticketsToBeVerified}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Tickets to be assigned"
            value={ticketsToBeAssigned}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Tickets closed" value={TicketsClosed} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Create Tickets"
              description="Create the tickets that need to be resolved"
              onClick={() => router.push("/tickets/create")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Verify Tickets"
              description="Tickets pending for verification"
              onClick={() => router.push("/tickets/verify")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Ticket History"
              description="Tickets which are closed, verified and resolved are shown"
              onClick={() => router.push("/tickets/history")}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
