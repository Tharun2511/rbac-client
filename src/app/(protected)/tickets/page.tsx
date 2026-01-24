"use client";

import { Button, Box } from "@mui/material";
import { useUserTickets } from "@/hooks/tickets/useUserTickets";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketList from "@/app/components/tickets/TicketList";
import { ArrowBack } from "@mui/icons-material";

export default function UserTicketsPage() {
  const { tickets, loading } = useUserTickets();
  const router = useRouter();

  return (
    <>
      <PageHeader title="My Tickets" />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          onClick={() => router.push("/user")}
          startIcon={<ArrowBack />}
          color="error"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push("/tickets/create")}
        >
          + Create Ticket
        </Button>
      </Box>
      <TicketList tickets={tickets} loading={loading} />
    </>
  );
}
