import { getAllTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";

export default function useManagerDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return {
    totalTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === "OPEN").length,
    assignedTickets: tickets.filter((t) => t.status === "ASSIGNED").length,
    resolvedTickets: tickets.filter((t) => t.status === "RESOLVED_BY_RESOLVER")
      .length,
    verifiedTickets: tickets.filter((t) => t.status === "VERIFIED_BY_USER")
      .length,
    loading,
  };
}
