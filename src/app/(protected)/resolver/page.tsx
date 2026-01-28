"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useResolverDashboard from "@/hooks/dashboards/useResolverDashboard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import StatCard from "@/app/components/dashboard/StatsCard";
import QuickActionCard from "@/app/components/dashboard/QuickActionCard";

export default function ResolverDashboardPage() {
  const router = useRouter();

  const { assigned, pending, awaitingUserVerification, loading } =
    useResolverDashboard();

  if (loading) return <LoadingState label="loading resolver tickets..." />;

  return (
    <>
      <PageHeader title="Resolver Dashboard" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Assigned Tickets" value={assigned} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Pending Resolution" value={pending} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Awaiting User Verification"
            value={awaitingUserVerification}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
          Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <QuickActionCard
              title="View Assigned Tickets"
              description="Work on your assigned tasks"
              onClick={() => router.push("/resolver/tickets")}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
