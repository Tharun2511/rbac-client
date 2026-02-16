"use client";

import { Box, Typography, Paper, Stack, Avatar } from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  ArrowRightAlt as ArrowRightAltIcon,
} from "@mui/icons-material";
import { ITicket } from "@/lib/types";
import LabelChip from "../data/LabelChip";

interface Props {
  ticket: ITicket;
  onClick?: () => void;
}

export default function TicketItem({ ticket, onClick }: Props) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 3,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        borderColor: "divider",
        "&:hover": onClick
          ? {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: (theme) => theme.shadows[4],
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
      >
        {/* Left Section: Content */}
        <Box flexGrow={1}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <LabelChip type="ticketType" value={ticket.type || "GENERAL"} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {ticket.title}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            color="text.secondary"
          >
            {/* Created By */}
            <Box display="flex" alignItems="center" gap={0.8}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: 10,
                  bgcolor: "primary.main",
                }}
              >
                {ticket.creatorName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {ticket.creatorName}
              </Typography>
            </Box>

            {/* Created At */}
            <Box display="flex" alignItems="center" gap={0.8}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>

            {/* Assignee */}
            {ticket.resolverName && (
              <Box display="flex" alignItems="center" gap={0.8}>
                <ArrowRightAltIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    bgcolor: "secondary.main",
                  }}
                >
                  {ticket.resolverName?.toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight={500}>
                  {ticket.resolverName}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Right Section: Status & Priority */}
        <Box
          display="flex"
          flexDirection={{ xs: "row", sm: "column" }}
          alignItems={{ xs: "center", sm: "flex-end" }}
          gap={1}
          minWidth={120}
        >
          <LabelChip type="status" value={ticket.status} />
          <LabelChip type="priority" value={ticket.priority || "LOW"} />
        </Box>
      </Box>
    </Paper>
  );
}
