"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useManagerDashboard from "@/hooks/dashboards/useManagerDashboard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import StatCard from "@/app/components/dashboard/StatsCard";
import QuickActionCard from "@/app/components/dashboard/QuickActionCard";

export default function ManagerDashboardPage() {
  const router = useRouter();
  const {
    totalTickets,
    openTickets,
    assignedTickets,
    resolvedTickets,
    verifiedTickets,
    loading,
  } = useManagerDashboard();

  if (loading) return <LoadingState label="Loading Manager Stats..." />;

  return (
    <>
      <PageHeader title="Manager Dashboard" />

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Total Tickets" value={totalTickets} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Open Tickets" value={openTickets} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Assigned Tickets" value={assignedTickets} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Awaiting Verification" value={resolvedTickets} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Ready to Close" value={verifiedTickets} />
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
          Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <QuickActionCard
              title="View All Tickets"
              description="Assign resolvers, monitor status, close Tickets"
              onClick={() => router.push("/manager/tickets")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <QuickActionCard
              title="Assigned Tickets"
              description="Tickets waiting for resolver action"
              onClick={() => router.push("/manager/tickets?filter=assigned")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <QuickActionCard
              title="Pending Closure"
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
