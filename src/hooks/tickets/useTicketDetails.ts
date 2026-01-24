import { getTicketById } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useTicketDetails(id: string) {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getTicketById(id);
    setTicket(data);
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      await refresh();
      if (isMounted) {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, refresh]);

  return {
    ticket,
    loading,
    refresh,
  };
}
