import { useState, useEffect } from "react";
import { apiClient } from "../api";
import { TicketStats } from "./useDashboardAnalytics";

export interface RequesterTurnaroundTime {
  completedTickets: number;
  avgTurnaroundDays: number;
}

export interface RequesterActivity {
  id: string;
  type: string;
  ticketId: string;
  ticketTitle: string;
  performedBy: string;
  performedByName: string;
  metadata: any;
  createdAt: string;
}

export interface RequesterAnalytics {
  stats: TicketStats;
  turnaroundTime: RequesterTurnaroundTime;
  recentActivity: RequesterActivity[];
}

export function useRequesterAnalytics(orgId?: string) {
  const [data, setData] = useState<RequesterAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient<RequesterAnalytics>(
          "/analytics/requester",
          { auth: true }
        );
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch analytics")
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
  }, [orgId]);

  return { data, loading, error };
}
