"use client";

import QuickActionCard from "@/app/components/dashboard/QuickActionCard";
import StatCard from "@/app/components/dashboard/StatsCard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import useResolverDashboard from "@/hooks/dashboards/useResolverDashboard";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";

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

      <Grid container spacing={2} mt={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickActionCard
            title="View Assigned Tickets"
            description="Work on your assigned tasks"
            onClick={() => router.push("/resolver/tickets")}
          />
        </Grid>
      </Grid>
    </>
  );
}
