"use client";

import { Box, Typography } from "@mui/material";
import { ITicket } from "@/lib/types";
import LabelChip from "../data/LabelChip";

export default function TicketDetailsHeader({ ticket }: { ticket: ITicket }) {
  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          {ticket.title}
        </Typography>

        <LabelChip type="status" value={ticket.status} />
      </Box>

      <Typography variant="body2" color="text.secondary" mt={1}>
        Created by <strong>{ticket.createdUser.name}</strong>
        {ticket.resolver.name ? (
          <>
            {" "}
            • Assigned to <strong>{ticket.resolver.name}</strong>
          </>
        ) : null}
      </Typography>

      <Typography
        variant="caption"
        color="text.disabled"
        mt={0.5}
        display="block"
      >
        Created at {new Date(ticket.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
}
