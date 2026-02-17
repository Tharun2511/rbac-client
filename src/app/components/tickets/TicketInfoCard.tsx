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
import { Subject, History, ArrowRightAlt } from "@mui/icons-material";
import { useState } from "react";
import TicketTimeline from "./TicketTimeline";
import LabelChip from "../data/LabelChip";

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
        borderRadius: 3,
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box p={3} pb={2} bgcolor="background.default">
        {/* Chips & ID Row */}
        <Stack
          direction="row"
          spacing={1}
          mb={2}
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <LabelChip type="ticketType" value={ticket.type || "GENERAL"} />
          <LabelChip type="priority" value={ticket.priority || "LOW"} />
          <Box flexGrow={1} />
          <LabelChip type="status" value={ticket.status} />
        </Stack>

        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          color="text.primary"
          sx={{ mb: 2, fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          {ticket.title}
        </Typography>

        {/* Metadata Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          color="text.secondary"
        >
          {/* Reporter */}
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "0.75rem",
                bgcolor: "primary.main",
              }}
              alt={ticket.creatorName}
            >
              {ticket.creatorName?.charAt(0)}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {ticket.creatorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              opened{" "}
              {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>

          {/* Resolver (if exists) */}
          {ticket.resolverName && (
            <Box display="flex" alignItems="center" gap={1}>
              <ArrowRightAlt sx={{ color: "text.disabled" }} />
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.75rem",
                  bgcolor: "secondary.main",
                }}
                alt={ticket.resolverName}
              >
                {ticket.resolverName.charAt(0)}
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {ticket.resolverName}
              </Typography>
            </Box>
          )}
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
