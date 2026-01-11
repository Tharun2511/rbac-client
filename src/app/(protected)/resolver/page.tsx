'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/lib/types';
import { getTickets, resolveTicket } from '@/lib/api/api.tickets';

export default function ResolverDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  async function handleResolve(id: string) {
    await resolveTicket(id);
    setTickets(await getTickets());
  }

  return (
    <ul>
      {tickets.map(t => (
        <li key={t.id}>
          {t.title} — {t.status}
          {t.status === 'ASSIGNED' && (
            <button onClick={() => handleResolve(t.id)}>Resolve</button>
          )}
        </li>
      ))}
    </ul>
  );
}
