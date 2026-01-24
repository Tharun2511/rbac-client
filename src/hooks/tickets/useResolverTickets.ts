import { getAssignedTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";
import useUserDetails from "../useUserDetails";

export function useResolverTickets() {
  const user = useUserDetails();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedTickets(user?.id || "")
      .then(setTickets)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { tickets, loading };
}
