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
  const { status } = ticket;

  return (
    <Box mt={2} display="flex" gap={2}>
      {/* MANAGER ACTION: Assign Resolver */}
      {role === "MANAGER" && status === "OPEN" && (
        <Button variant="contained" onClick={onAssign}>
          Assign Resolver
        </Button>
      )}

      {/* RESOLVER ACTION: Resolve Ticket */}
      {role === "RESOLVER" && status === "ASSIGNED" && (
        <Button variant="contained" color="primary" onClick={onResolve}>
          Mark as Resolved
        </Button>
      )}

      {/* USER ACTION: Verify Resolution */}
      {role === "USER" && status === "RESOLVED" && (
        <Button variant="contained" color="secondary" onClick={onVerify}>
          Verify Resolution
        </Button>
      )}

      {/* MANAGER ACTION: Close Ticket */}
      {role === "MANAGER" && status === "VERIFIED" && (
        <Button variant="contained" color="success" onClick={onClose}>
          Close Ticket
        </Button>
      )}
    </Box>
  );
}
