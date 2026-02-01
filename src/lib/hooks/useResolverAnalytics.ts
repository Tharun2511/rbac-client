import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface ResolverAnalytics {
  workload: {
    assigned: number;
    inProgress: number;
    resolvedToday: number;
  };
  resolutionTrend: {
    day: string;
    resolved: number;
  }[];
  inflowOutflow: {
    day: string;
    inflow: number;
    outflow: number;
  }[];
  avgResolutionDays: number;
  resolutionHeatmap: {
    hour: number;
    count: number;
  }[];
}

const MOCK_DATA: ResolverAnalytics = {
  workload: {
    assigned: 12,
    inProgress: 6,
    resolvedToday: 4,
  },
  resolutionTrend: [
    { day: "2024-01-01", resolved: 3 },
    { day: "2024-01-02", resolved: 5 },
    { day: "2024-01-03", resolved: 2 },
    { day: "2024-01-04", resolved: 8 },
    { day: "2024-01-05", resolved: 6 },
    { day: "2024-01-06", resolved: 4 },
    { day: "2024-01-07", resolved: 7 },
  ],
  inflowOutflow: [
    { day: "2024-01-01", inflow: 5, outflow: 3 },
    { day: "2024-01-02", inflow: 4, outflow: 5 },
    { day: "2024-01-03", inflow: 6, outflow: 2 },
    { day: "2024-01-04", inflow: 3, outflow: 8 },
    { day: "2024-01-05", inflow: 7, outflow: 6 },
    { day: "2024-01-06", inflow: 2, outflow: 4 },
    { day: "2024-01-07", inflow: 5, outflow: 7 },
  ],
  avgResolutionDays: 2.4,
  resolutionHeatmap: [
    { hour: 9, count: 3 },
    { hour: 10, count: 5 },
    { hour: 11, count: 2 },
    { hour: 13, count: 4 },
    { hour: 14, count: 7 },
    { hour: 15, count: 6 },
    { hour: 16, count: 5 },
    { hour: 17, count: 2 },
  ],
};

export function useResolverAnalytics() {
  const [data, setData] = useState<ResolverAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient<ResolverAnalytics>(
        "/analytics/resolver",
        { auth: true },
      );
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch resolver analytics"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { data, loading, error, refresh: fetchAnalytics };
}
