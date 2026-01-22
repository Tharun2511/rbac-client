"use client";

import { ITicket } from "@/lib/types";
import { Box, Paper, Typography } from "@mui/material";

export default function TicketInfoCard({ ticket }: { ticket: ITicket }) {
  return (
    <Paper elevation={1}>
      <Box p={2}>
        <Typography variant="subtitle1" fontWeight="600">
          Description
        </Typography>

        <Typography variant="body2" mt={1} whiteSpace="pre-line">
          {ticket.description}
        </Typography>
      </Box>
    </Paper>
  );
}
