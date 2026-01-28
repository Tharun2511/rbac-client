"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useMyTicketHistory } from "@/hooks/tickets/useMyTicketsHistory";
import { useRouter } from "next/navigation";

export default function TicketHistoryPage() {
  const router = useRouter();
  const { tickets, loading } = useMyTicketHistory();

  return (
    <>
      <PageHeader title="Ticket History" />
      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
