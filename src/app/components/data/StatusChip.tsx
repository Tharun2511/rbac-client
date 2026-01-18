"use client";

import { Chip } from "@mui/material";

const statusColors: Record<
  string,
  "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error"
> = {
  OPEN: "warning",
  ASSIGNED: "primary",
  RESOLVED_BY_RESOLVER: "info",
  VERIFIED_BY_USER: "success",
  CLOSED: "default",
  ADMIN: "error",
  MANAGER: "success",
  RESOLVER: "info",
  USER: "default",
};

const StatusChip = ({ status = "" }: { status: string }) => {
  console.log(status);
  return (
    <Chip
      label={status.replaceAll("_", " ")}
      color={statusColors[status] || "default"}
      size="small"
    />
  );
};

export default StatusChip;
