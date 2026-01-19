"use client";

import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function TopBar() {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Internal Workflow Platform
        </Typography>

        <Box flexGrow={1} />

        {/* Right side actions will come later */}
      </Toolbar>
    </AppBar>
  );
}
