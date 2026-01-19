"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <TopBar />

      <Box
        component="main"
        flexGrow={1}
        px={3}
        py={2}
        bgcolor="background.default"
      >
        {children}
      </Box>
    </Box>
  );
}
