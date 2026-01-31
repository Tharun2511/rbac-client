import { ITicket } from "@/lib/types";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  ticket: ITicket;
  role: string;
  onAssign?: () => void;
  onUpdateType?: (type: string) => void;
  onUpdatePriority?: (priority: string) => void;
  onResolve?: () => void;
  onVerify?: () => void;
  onClose?: () => void;
  loading?: boolean;
}

export default function TicketActions({
  ticket,
  role,
  onAssign,
  onUpdateType,
  onUpdatePriority,
  onResolve,
  onVerify,
  onClose,
  loading,
}: Props) {
  const { status, type, priority } = ticket;
  const isClassified = !!type;

  // Menu States
  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTypeAnchor(event.currentTarget);
  };

  const handlePriorityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPriorityAnchor(event.currentTarget);
  };

  const handleTypeClose = (newType?: string) => {
    if (newType && onUpdateType && newType !== type) {
      onUpdateType(newType);
    }
    setTypeAnchor(null);
  };

  const handlePriorityClose = (newPriority?: string) => {
    if (newPriority && onUpdatePriority && newPriority !== priority) {
      onUpdatePriority(newPriority);
    }
    setPriorityAnchor(null);
  };

  const TICKET_TYPES = ["BUG", "FEATURE", "SUPPORT", "GENERAL"];
  const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      {/* MANAGER ACTIONS: Classification Controls */}
      {role === "MANAGER" && (status === "OPEN" || status === "ASSIGNED") && (
        <Box display="flex" gap={1}>
          {/* Change Type Button */}
          <Button
            variant="outlined"
            onClick={handleTypeClick}
            disabled={loading}
            fullWidth
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderRadius: 2, justifyContent: "space-between" }}
          >
            {type ? type : "Set Type"}
          </Button>
          <Menu
            anchorEl={typeAnchor}
            open={Boolean(typeAnchor)}
            onClose={() => handleTypeClose()}
          >
            {TICKET_TYPES.map((t) => (
              <MenuItem
                key={t}
                onClick={() => handleTypeClose(t)}
                selected={t === type}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Menu>

          {/* Change Priority Button */}
          <Button
            variant="outlined"
            onClick={handlePriorityClick}
            disabled={loading}
            fullWidth
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderRadius: 2, justifyContent: "space-between" }}
          >
            {priority}
          </Button>
          <Menu
            anchorEl={priorityAnchor}
            open={Boolean(priorityAnchor)}
            onClose={() => handlePriorityClose()}
          >
            {PRIORITIES.map((p) => (
              <MenuItem
                key={p}
                onClick={() => handlePriorityClose(p)}
                selected={p === priority}
              >
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {/* MANAGER ACTION: Assign Resolver - Only enabled if classified */}
      {role === "MANAGER" && status === "OPEN" && (
        <Button
          variant="contained"
          fullWidth
          onClick={onAssign}
          disabled={!isClassified}
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
