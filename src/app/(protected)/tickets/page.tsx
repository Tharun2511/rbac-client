"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useUserTickets } from "@/hooks/tickets/useUserTickets";
import { useRouter } from "next/navigation";

export default function UserTicketsPage() {
  const router = useRouter();
  const { tickets, loading } = useUserTickets();

  return (
    <>
      <PageHeader title="My Tickets" />

      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
