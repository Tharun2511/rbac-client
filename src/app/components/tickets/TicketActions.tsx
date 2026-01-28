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
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      {/* MANAGER ACTION: Assign Resolver */}
      {role === "MANAGER" && status === "OPEN" && (
        <Button
          variant="contained"
          fullWidth
          onClick={onAssign}
          sx={{ borderRadius: 2 }}
        >
          Assign Resolver
        </Button>
      )}

      {/* RESOLVER ACTION: Resolve Ticket */}
      {role === "RESOLVER" && status === "ASSIGNED" && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onResolve}
          sx={{ borderRadius: 2 }}
        >
          Mark as Resolved
        </Button>
      )}

      {/* USER ACTION: Verify Resolution */}
      {role === "USER" && status === "RESOLVED" && (
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onVerify}
          sx={{ borderRadius: 2 }}
        >
          Verify Resolution
        </Button>
      )}

      {/* MANAGER ACTION: Close Ticket */}
      {role === "MANAGER" && status === "VERIFIED" && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={onClose}
          sx={{ borderRadius: 2 }}
        >
          Close Ticket
        </Button>
      )}
    </Box>
  );
}
