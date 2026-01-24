import { useEffect, useState } from "react";
import { ITicket } from "@/lib/types";
import { getMyTicketHistory } from "@/lib/api/api.tickets";
import useUserDetails from "../useUserDetails";

export function useMyVerifyTickets() {
  const user = useUserDetails();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTicketHistory()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return {
    tickets: tickets.filter(
      (t) => t.status === "RESOLVED" && t.createdBy === user?.id,
    ),
    loading,
  };
}
