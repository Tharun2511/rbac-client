import { useEffect, useState } from "react";
import { ITicket } from "@/lib/types";
import { getMyTicketHistory } from "@/lib/api/api.tickets";

export function useMyTicketHistory() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTicketHistory()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return { tickets, loading };
}
