import { getTicketComments, createComment } from "@/lib/api/api.tickets";
import { IComment } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useTicketComments(ticketId: string) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (!ticketId) return;
      // Don't set loading to true on refresh to avoid flickering if already loaded once
      // or handle it gracefully in UI.
      // But initial load needs loading true.
      const data = await getTicketComments(ticketId);
      // Sort comments by date desc if not already
      // Assuming API returns them or we sort here
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

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
    comments,
    loading,
    submitting,
    refresh,
    addComment,
  };
}
