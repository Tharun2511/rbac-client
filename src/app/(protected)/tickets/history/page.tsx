"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useUserTickets } from "@/hooks/tickets/useUserTickets";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";

export default function TicketHistoryPage() {
  const router = useRouter();
  const { tickets, loading } = useUserTickets();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader title="My Tickets" />
      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </Container>
  );
}
