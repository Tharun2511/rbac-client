import { getTicketById } from "@/lib/api/api.tickets";
import { useEffect, useState } from "react";

export function useTicketDetails(id: string) {
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await getTicketById(id);
    setTicket(data);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [id]);

  return {
    ticket,
    loading,
    refresh,
  };
}
