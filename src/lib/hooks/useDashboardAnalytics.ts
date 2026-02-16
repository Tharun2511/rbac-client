import { useState, useEffect } from "react";
import { apiClient } from "../api";
import { useRBAC } from "@/context/RBACContext";

export interface TicketStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  totalTickets: number;
}

export interface PriorityBucket {
  priority: string;
  count: number;
}

export interface StatusBucket {
  status: string;
  count: number;
}

export interface OrgAnalytics {
  stats: TicketStats;
  byPriority: PriorityBucket[];
  byStatus: StatusBucket[];
}

export interface MyAnalytics {
  stats: TicketStats;
}

export function useDashboardAnalytics() {
  const { activeOrgId, can, isSystemAdmin } = useRBAC();

  const [orgData, setOrgData] = useState<OrgAnalytics | null>(null);
  const [myData, setMyData] = useState<MyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const canViewOrg = isSystemAdmin || can("analytics.view.org");
  const canViewSelf = can("analytics.view.self");

  useEffect(() => {
    // Need either an active org OR be a system admin to fetch analytics
    if (!activeOrgId && !isSystemAdmin) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // Fetch org-wide and personal analytics independently
        // so a 403 on one doesn't block the other
        const [orgResult, myResult] = await Promise.allSettled([
          canViewOrg
            ? apiClient<OrgAnalytics>("/analytics/org", { auth: true })
            : Promise.resolve(null),
          canViewSelf && activeOrgId
            ? apiClient<MyAnalytics>("/analytics/me", { auth: true })
            : Promise.resolve(null),
        ]);

        if (cancelled) return;

        if (orgResult.status === "fulfilled" && orgResult.value) {
          setOrgData(orgResult.value);
        }

        if (myResult.status === "fulfilled" && myResult.value) {
          setMyData(myResult.value);
        }

        // Only set error if both failed
        if (orgResult.status === "rejected" && myResult.status === "rejected") {
          setError(
            orgResult.reason instanceof Error
              ? orgResult.reason
              : new Error("Failed to fetch analytics"),
          );
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err : new Error("Failed to fetch analytics"),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [activeOrgId, canViewOrg, canViewSelf, isSystemAdmin]);

  return { orgData, myData, loading, error, canViewOrg };
}
