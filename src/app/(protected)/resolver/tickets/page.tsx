"use client";

import { Suspense } from "react";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useResolverTickets } from "@/hooks/tickets/useResolverTickets";
import { useRouter } from "next/navigation";
import LoadingState from "@/app/components/feedback/LoadingState";
import RouteBack from "@/app/components/layout/RouteBackButton";

function ResolverTicketsContent() {
  const router = useRouter();
  const { tickets, loading } = useResolverTickets();
  return (
    <>
      <RouteBack />
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
