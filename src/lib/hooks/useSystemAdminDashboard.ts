import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface SystemOrgStats {
  totalOrgs: number;
  totalUsers: number;
  totalProjects: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface OrgMemberDistribution {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
}

export interface OrgTimelineData {
  date: string;
  count: number;
}

export interface RoleDistribution {
  role: string;
  count: number;
}

export interface SystemAdminAnalytics {
  stats: SystemOrgStats;
  memberDistribution: OrgMemberDistribution[];
  orgTimeline: OrgTimelineData[];
  roleDistribution: RoleDistribution[];
}

export function useSystemAdminDashboard() {
  const [data, setData] = useState<SystemAdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient<SystemAdminAnalytics>(
          "/analytics/system",
          { auth: true },
        );
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch analytics"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
