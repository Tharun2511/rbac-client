"use client";

import { Suspense } from "react";
import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useManagerTicketList } from "@/hooks/useManagerTicketsList";
import { useRouter, useSearchParams } from "next/navigation";
import RouteBack from "@/app/components/layout/RouteBackButton";

function ManagerTicketsContent() {
  const router = useRouter();
  const search = useSearchParams();
  const filter = search.get("filter");

  const { tickets, loading } = useManagerTicketList(filter);

  const titles: Record<string, string> = {
    assigned: "Assigned Tickets",
    "ready-to-close": "Ready for Closure",
    "awaiting-verification": "Awaiting User Verification",
  };

  const pageTitle = titles[filter ?? ""] || "All Tickets";

  if (loading) return <LoadingState label="loading tickets..." />;

  return (
    <>
      <RouteBack />

      <PageHeader title={pageTitle} />

      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}

export default function ManagerTicketsPage() {
  return (
    <Suspense fallback={<LoadingState label="loading tickets..." />}>
      <ManagerTicketsContent />
    </Suspense>
  );
}
