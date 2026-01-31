"use client";

import { ITicket } from "@/lib/types";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Stack,
} from "@mui/material";
import { Subject, History } from "@mui/icons-material";
import { useState } from "react";
import TicketTimeline from "./TicketTimeline";

export default function TicketInfoCard({ ticket }: { ticket: ITicket }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section of the Card */}
      <Box p={4} pb={2}>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          color="text.primary"
        >
          {ticket.title}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "0.75rem",
                bgcolor: "#0052CC",
              }}
              alt={ticket.createdUser?.name}
              src="/static/images/avatar/1.jpg"
            >
              {ticket.createdUser?.name?.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {ticket.createdUser?.name} opened this ticket
            </Typography>
          </Box>
          <Typography variant="body2" color="text.disabled">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(ticket.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {/* Tabs */}
      <Box px={4}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<Subject fontSize="small" />}
            iconPosition="start"
            label="Description"
          />
          <Tab
            icon={<History fontSize="small" />}
            iconPosition="start"
            label="Timeline"
          />
        </Tabs>
      </Box>
      <Divider />

      {/* Content */}
      <Box
        p={4}
        flexGrow={1}
        sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        {tabValue === 0 && (
          <Box sx={{ overflowY: "auto" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: "1rem", color: "text.primary" }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.description}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && <TicketTimeline ticket={ticket} />}
      </Box>
    </Paper>
  );
}
