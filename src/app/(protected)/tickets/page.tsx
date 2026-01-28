"use client";

import { useUserTickets } from "@/hooks/tickets/useUserTickets";
import { useRouter } from "next/navigation";
import TicketList from "@/app/components/tickets/TicketList";
import PageHeader from "@/app/components/layout/PageHeader";

export default function UserTicketsPage() {
  const { tickets, loading } = useUserTickets();
  const router = useRouter();

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
