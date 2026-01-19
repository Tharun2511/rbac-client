"use client";

import QuickActionCard from "@/app/components/dashboard/QuickActionCard";
import StatCard from "@/app/components/dashboard/StatsCard";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import useAdminDashboard from "@/hooks/useAdminDashboard";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { totalUsers, activeUsers, managers, resolvers, loading } =
    useAdminDashboard();

  if (loading) return <LoadingState label="Loading Admin stats..." />;

  return (
    <>
      <PageHeader title="Admin Dashboard" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Users" value={totalUsers} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Active Users" value={activeUsers} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Managers" value={managers} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Resolvers" value={resolvers} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              title="Manage Users"
              description="Create, edit roles, activate or deactivate users"
              onClick={() => router.push("/admin/users")}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
