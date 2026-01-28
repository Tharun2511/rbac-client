"use client";

import { ITicket } from "@/lib/types";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import LabelChip from "../data/LabelChip";
import { ReactNode } from "react";

interface TicketSidebarProps {
  ticket: ITicket;
  actions?: ReactNode;
}

export default function TicketSidebar({ ticket, actions }: TicketSidebarProps) {
  return (
    <Stack spacing={2}>
      {/* Actions Panel */}
      {actions && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            mb={2}
            color="text.secondary"
          >
            ACTIONS
          </Typography>
          <Stack spacing={1}>{actions}</Stack>
        </Paper>
      )}

      {/* Status Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          mb={2}
          color="text.secondary"
        >
          STATUS
        </Typography>
        <Box display="flex" alignItems="center">
          <LabelChip type="status" value={ticket.status} />
        </Box>
      </Paper>

      {/* Details Panel */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <Accordion
          defaultExpanded
          elevation={0}
          disableGutters
          sx={{ "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
            >
              Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Stack spacing={3}>
              {/* Assignee */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  Assignee
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                    {ticket.resolver?.name?.charAt(0) || "?"}
                  </Avatar>
                  <Typography variant="body2">
                    {ticket.resolver?.name || "Unassigned"}
                  </Typography>
                </Stack>
              </Box>

              {/* Reporter */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  Reporter
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                    {ticket.createdUser?.name?.charAt(0) || "?"}
                  </Avatar>
                  <Typography variant="body2">
                    {ticket.createdUser?.name}
                  </Typography>
                </Stack>
              </Box>

              {/* Dates */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  Dates
                </Typography>
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    fontSize="0.8rem"
                    color="text.secondary"
                  >
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize="0.8rem"
                    color="text.secondary"
                  >
                    Updated: {new Date(ticket.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Stack>
  );
}
