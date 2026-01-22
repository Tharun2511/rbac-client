"use client";

import { Box, Typography } from "@mui/material";
import StatusChip from "../data/StatusChip";
import { ITicket } from "@/lib/types";

interface Props {
  ticket: ITicket;
  onClick?: () => void;
}

export default function TicketItem({ ticket, onClick }: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={1.5}
      px={2}
      sx={{
        cursor: onClick ? "pointer" : "default",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        "&:hover": onClick ? { backgroundColor: "action.hover" } : {},
      }}
      onClick={onClick}
    >
      {/* Left Section */}
      <Box>
        <Typography fontWeight={600}>{ticket.title}</Typography>

        <Typography variant="body2" color="text.secondary">
          Created by {ticket.createdUser.name}
          {ticket.resolver.name ? ` • Assigned to ${ticket.resolver.name}` : ""}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          {new Date(ticket.createdAt).toLocaleString()}
        </Typography>
      </Box>

      {/* Right Section */}
      <StatusChip status={ticket.status} />
    </Box>
  );
}
