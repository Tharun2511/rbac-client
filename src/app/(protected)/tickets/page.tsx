"use client";

import { getAllTickets } from "@/lib/api/api.tickets";
import { useRouter } from "next/navigation";
import TicketList from "@/app/components/tickets/TicketList";
import PageHeader from "@/app/components/layout/PageHeader";
import { ITicket } from "@/lib/types";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader title="All Tickets" />
      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </Container>
  );
}
