"use client";

import { assignTicket, closeTicket, getAllTickets } from "@/lib/api/api.tickets";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ManagerDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    getAllTickets().then(setTickets);
  }, []);

  async function handleAssign(id: string) {
    await assignTicket(id, "resolver-id");
    setTickets(await getAllTickets());
  }

  async function handleClose(id: string) {
    await closeTicket(id);
    setTickets(await getAllTickets());
  }

  return (
    <ul>
      {tickets.map((t) => (
        <li key={t.id}>
          {t.title} — {t.status}
          {t.status === "OPEN" && (
            <button onClick={() => handleAssign(t.id)}>Assign</button>
          )}
          {t.status === "VERIFIED_BY_USER" && (
            <button onClick={() => handleClose(t.id)}>Close</button>
          )}
        </li>
      ))}
    </ul>
  );
}
