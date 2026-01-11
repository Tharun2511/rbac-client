'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/lib/types';
import { createTicket, getTickets, verifyTicket } from '@/lib/api/api.tickets';

export default function UserDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  async function handleCreate() {
    await createTicket('Sample Issue', 'Something is broken');
    setTickets(await getTickets());
  }

  async function handleVerify(id: string) {
    await verifyTicket(id);
    setTickets(await getTickets());
  }

  return (
    <>
      <button onClick={handleCreate}>Create Ticket</button>

      <ul>
        {tickets.map(t => (
          <li key={t.id}>
            {t.title} — {t.status}
            {t.status === 'RESOLVED_BY_RESOLVER' && (
              <button onClick={() => handleVerify(t.id)}>Verify</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
