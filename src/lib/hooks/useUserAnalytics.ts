import { useState, useEffect } from "react";
import { ITicket } from "../types";
import { apiClient } from "../api";
import { getMyTickets } from "../api/api.tickets";

export interface TicketStatusSummary {
  OPEN: number;
  ASSIGNED: number;
  RESOLVED: number;
  VERIFIED: number;
  CLOSED: number;
  TOTAL: number;
}

export interface CreationTrendItem {
  day: string;
  count: number;
}

export interface UserAnalyticsResponse {
  statusSummary: TicketStatusSummary;
  creationTrend: CreationTrendItem[];
  averageResolutionTime: string;
}

export interface UserAnalytics {
  totalTickets: number;
  openTickets: number;
  avgResolutionTime: string;
  ticketStatusData: { label: string; value: number; color: string }[];
  ticketsOverTime: { date: string; value: number }[];
  recentTickets: ITicket[];
}

const STATUS_COLORS = {
  OPEN: "#6366f1", // Indigo
  ASSIGNED: "#f59e0b", // Amber
  RESOLVED: "#10b981", // Emerald
  VERIFIED: "#06b6d4", // Cyan
  CLOSED: "#64748b", // Slate
};

export function useUserAnalytics() {
  const [data, setData] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        const [analytics, recentTickets] = await Promise.all([
          apiClient<UserAnalyticsResponse>("/analytics/user", { auth: true }),
          getMyTickets(),
        ]);

        const ticketStatusData = Object.entries(analytics.statusSummary)
          .filter(([key]) => key !== "TOTAL")
          .map(([label, value]) => ({
            label: label.charAt(0) + label.slice(1).toLowerCase(), // Capitalize
            value: Number(value),
            color:
              STATUS_COLORS[label as keyof typeof STATUS_COLORS] || "#94a3b8",
          }))
          .filter((item) => item.value > 0); // Optional: filter out zero values if desired, or keep them

        const ticketsOverTime = analytics.creationTrend.map((item) => ({
          date: item.day,
          value: item.count,
        }));

        setData({
          totalTickets: analytics.statusSummary.TOTAL,
          openTickets: analytics.statusSummary.OPEN,
          avgResolutionTime: analytics.averageResolutionTime,
          ticketStatusData,
          ticketsOverTime,
          recentTickets: recentTickets.slice(0, 5), // Limit to 5 recent tickets
        });
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch analytics"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { data, loading, error };
}
