import { getTicketTimeline, createComment } from "@/lib/api/api.tickets";
import { ITimelineItem } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useTicketTimeline(ticketId: string, refreshDep?: unknown) {
  const [timeline, setTimeline] = useState<ITimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (!ticketId) return;
      const data = await getTicketTimeline(ticketId);
      setTimeline(data);
    } catch (error) {
      console.error("Failed to fetch timeline", error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    // Only show loading on first load or if explicitly desired
    // For status updates, we might want to just refresh silently or show loading
    // sticking to original behavior:
    refresh();
  }, [refresh, refreshDep]);

  const addComment = async (text: string) => {
    try {
      setSubmitting(true);
      await createComment(ticketId, text);
      await refresh();
      return true;
    } catch (error) {
      console.error("Failed to add comment", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    timeline,
    loading,
    submitting,
    refresh,
    addComment,
  };
}
