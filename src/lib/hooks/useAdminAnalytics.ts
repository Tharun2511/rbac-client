import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface AdminAnalytics {
  usersByRole: {
    role: string;
    count: number;
  }[];
  activeUsers: {
    active: number;
    inactive: number;
  };
  signups: {
    day: string;
    count: number;
  }[];
  ticketSummary: {
    totalTickets: number;
  };
  systemActivityHeatmap: {
    day: string;
    hour: number;
    count: number;
  }[];
}

const MOCK_DATA: AdminAnalytics = {
  usersByRole: [
    { role: "USER", count: 28 },
    { role: "MANAGER", count: 4 },
    { role: "RESOLVER", count: 6 },
    { role: "ADMIN", count: 2 },
  ],
  activeUsers: {
    active: 32,
    inactive: 8,
  },
  signups: [
    { day: "2024-01-01", count: 3 },
    { day: "2024-01-02", count: 1 },
    { day: "2024-01-03", count: 5 },
    { day: "2024-01-04", count: 2 },
    { day: "2024-01-05", count: 8 },
    { day: "2024-01-06", count: 4 },
    { day: "2024-01-07", count: 6 },
  ],
  ticketSummary: {
    totalTickets: 106,
  },
  systemActivityHeatmap: [
    { day: "Monday", hour: 9, count: 3 },
    { day: "Monday", hour: 10, count: 7 },
    { day: "Monday", hour: 11, count: 4 },
    { day: "Tuesday", hour: 14, count: 5 },
    { day: "Wednesday", hour: 9, count: 2 },
    { day: "Wednesday", hour: 16, count: 8 },
    { day: "Friday", hour: 10, count: 5 },
  ],
};

export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Actual integration:
      const response = await apiClient<AdminAnalytics>("/analytics/admin", {
        auth: true,
      });
      setData(response);

      // Fallback to mock if empty (dev mode) - OPTIONAL, usually we just trust apiClient
      // setData(MOCK_DATA);
    } catch (err) {
      console.error(err);
      // For development/demo purposes without live backend, you might want to switch to mock data on error
      // setData(MOCK_DATA);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch admin analytics"),
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
