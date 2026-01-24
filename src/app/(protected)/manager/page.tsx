"use client";

import QuickActionCard from "@/app/components/dashboard/QuickActionCard";
import StatCard from "@/app/components/dashboard/StatsCard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import useManagerDashboard from "@/hooks/dashboards/useManagerDashboard";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();
  const {
    loading,
    assignedTickets,
    pendingReviewTickets,
    totalTickets,
    unassignedTickets,
  } = useManagerDashboard();

  if (loading) return <LoadingState label="Loading Manager stats..." />;

  return (
    <>
      <PageHeader title="Manager Dashboard" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Tickets" value={totalTickets} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Assigned Tickets" value={assignedTickets} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Unnassigned Tickets" value={unassignedTickets} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Review Pending Tickets"
            value={pendingReviewTickets}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="View All Tickets"
              description="Assign resolvers, monitor status, close tickets"
              onClick={() => router.push("/manager/tickets")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Assigned Tickets"
              description="View tickets currently assigned to resolvers"
              onClick={() => router.push("/manager/tickets?filter=assigned")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Awaiting Closure"
              description="Tickets verified by users and ready to close"
              onClick={() =>
                router.push("/manager/tickets?filter=ready-to-close")
              }
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
