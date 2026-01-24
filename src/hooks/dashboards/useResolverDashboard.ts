import { getAssignedTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";
import useUserDetails from "../useUserDetails";

export default function useResolverDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useUserDetails();

  console.log(user);

  useEffect(() => {
    getAssignedTickets(user?.id || "")
      .then(setTickets)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return {
    assigned: tickets.length,
    pending: tickets.filter((t) => t.status === "ASSIGNED").length,
    awaitingUserVerification: tickets.filter(
      (t) => t.status === "RESOLVED_BY_RESOLVER",
    ).length,
    loading,
  };
}
