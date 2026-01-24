"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useRouter } from "next/navigation";

export default function ResolverTicketsPage() {
  const router = useRouter();
  const { tickets, loading } = useResolverTickets();

  return (
    <>
      <PageHeader title="Assigned Tickets" />
      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
