"use client";

import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useMyVerifyTickets } from "@/hooks/tickets/useMyVerifyTickets";
import { useRouter } from "next/navigation";

export default function TicketVerifyPage() {
  const router = useRouter();
  const { tickets, loading } = useMyVerifyTickets();

  return (
    <>
      <PageHeader title="Tickets to be Verified" />
      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
