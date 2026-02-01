import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface ManagerAnalytics {
  statusSummary: {
    open: number;
    assigned: number;
    resolved: number;
    verified: number;
    closed: number;
    total: number;
  };
  ticketsPerResolver: {
    resolverId: number;
    resolverName: string;
    ticketCount: number;
  }[];
  dailyTicketTrend: {
    day: string;
    count: number;
  }[];
  resolverPerformance: {
    resolverId: number;
    resolverName: string;
    avgResolutionDays: number;
  }[];
  agingBuckets: {
    range: string;
    count: number;
  }[];
}

export function useManagerAnalytics() {
  const [data, setData] = useState<ManagerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient<ManagerAnalytics>("/analytics/manager", { auth: true });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch analytics"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { data, loading, error, refresh: fetchAnalytics };
}
