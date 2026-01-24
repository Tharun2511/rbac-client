import { getMyTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const useUserDashboard = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTickets()
      .then((t) => setTickets(t))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    return {
      totalTickets: tickets.length,
      TicketsClosed: tickets.filter((t) => t.status === "CLOSED").length,
      ticketsToBeVerified: tickets.filter((t) => t.status === "RESOLVED")
        .length,
      ticketsToBeAssigned: tickets.filter((t) => t.status === "OPEN").length,
      loading,
    };
  }, [tickets, loading]);

  return stats;
};

export default useUserDashboard;
