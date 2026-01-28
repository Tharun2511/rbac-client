"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function LoginCard({ children }: { children: ReactNode }) {
  return <Box width="100%">{children}</Box>;
}
