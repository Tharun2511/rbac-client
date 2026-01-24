"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useMyTicketHistory } from "@/hooks/tickets/useMyTicketsHistory";

export default function TicketHistoryPage() {
  const { tickets, loading } = useMyTicketHistory();

  return (
    <>
      <PageHeader title="Ticket History" />
      <TicketList tickets={tickets} loading={loading} />
    </>
  );
}
