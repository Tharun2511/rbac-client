'use client';

import { useSearchParams } from "next/navigation";
import { useManagerTicketList } from "@/hooks/useManagerTicketsList";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";

export default function ManagerTicketsPage() {
  const search = useSearchParams();
  const filter = search.get("filter");

  const { tickets, loading } = useManagerTicketList(filter);

  const titleMap: Record<string, string> = {
    assigned: "Assigned Tickets",
    "ready-to-close": "Tickets Awaiting Closure",
    "awaiting-verification": "Resolved — Awaiting User Verification",
  };

  const pageTitle = titleMap[filter ?? ""] ?? "All Tickets";

  return (
    <>
      <PageHeader title={pageTitle} />
        <TicketList tickets={tickets} loading={loading} />
    </>
  );
}
