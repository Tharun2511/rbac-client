"use client";

import LoadingState from "@/app/components/feedback/LoadingState";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { useManagerTicketList } from "@/hooks/useManagerTicketsList";
import { ITicket } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function ManagerTicketsPage() {
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
      <PageHeader title={pageTitle} />

      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
