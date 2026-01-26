"use client";

import { clearAuth } from "@/lib/auth";
import { Logout } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Internal Workflow Platform
        </Typography>

        <Box flexGrow={1} />

        <Button
          color="inherit"
          variant="text"
          onClick={() => {
            clearAuth();
            router.replace("/login");
          }}
          sx={{ textTransform: "none", fontSize: "16px" }}
          endIcon={<Logout />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
