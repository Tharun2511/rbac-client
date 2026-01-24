"use client";

import { Chip } from "@mui/material";

const statusColors: Record<
  string,
  "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error"
> = {
  OPEN: "warning",
  ASSIGNED: "primary",
  RESOLVED: "info",
  VERIFIED: "success",
  CLOSED: "default",
  ADMIN: "error",
  MANAGER: "success",
  RESOLVER: "info",
  USER: "default",
};

const StatusChip = ({ status = "" }: { status: string }) => {
  return (
    <Chip
      label={status.replaceAll("_", " ")}
      color={statusColors[status] || "default"}
      size="small"
    />
  );
};

export default StatusChip;
