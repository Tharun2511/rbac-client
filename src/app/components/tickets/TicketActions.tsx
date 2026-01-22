"use client";

import { ITicket } from "@/lib/types";
import { Box, Button } from "@mui/material";

interface Props {
  ticket: ITicket;
  role: string;
  onAssign?: () => void;
  onResolve?: () => void;
  onVerify?: () => void;
  onClose?: () => void;
}

export default function TicketActions({
  ticket,
  role,
  onAssign,
  onResolve,
  onVerify,
  onClose,
}: Props) {
  const status = ticket.status;

  return (
    <Box display="flex" gap={2} mt={3}>
      {role === "MANAGER" && status === "OPEN" && (
        <Button variant="contained" onClick={onAssign}>
          Assign Resolver
        </Button>
      )}

      {role === "RESOLVER" && status === "ASSIGNED" && (
        <Button variant="contained" color="warning" onClick={onResolve}>
          Mark Resolved
        </Button>
      )}

      {role === "USER" && status === "RESOLVED_BY_RESOLVER" && (
        <Button variant="contained" color="success" onClick={onVerify}>
          Verify Resolution
        </Button>
      )}

      {role === "MANAGER" && status === "VERIFIED_BY_USER" && (
        <Button variant="contained" color="success" onClick={onClose}>
          Close Ticket
        </Button>
      )}
    </Box>
  );
}
