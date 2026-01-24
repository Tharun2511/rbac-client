"use client";

import { getAllTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";

export function useManagerTicketList(filter?: string | null) {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets()
      .then((all) => {
        if (!filter) return setTickets(all);

        const filtered = {
          assigned: all.filter((t) => t.status === "ASSIGNED"),
          "ready-to-close": all.filter((t) => t.status === "VERIFIED"),
          "awaiting-verification": all.filter((t) => t.status === "RESOLVED"),
        }[filter];

        setTickets(filtered ?? []);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return { tickets, loading };
}
