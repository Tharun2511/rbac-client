"use client";

import { Suspense } from "react";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useResolverTickets } from "@/hooks/tickets/useResolverTickets";
import { useRouter } from "next/navigation";
import LoadingState from "@/app/components/feedback/LoadingState";

function ResolverTicketsContent() {
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

export default function ResolverTicketsPage() {
  return (
    <Suspense fallback={<LoadingState label="loading tickets..." />}>
      <ResolverTicketsContent />
    </Suspense>
  );
}
