"use client";

import { GUEST_CREDENTIALS } from "@/constant/guestCreds";
import { useLogin } from "@/hooks/useLogin";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

type Role = "admin" | "user" | "manager" | "resolver";

export default function GuestLoginOptions() {
  const login = useLogin();
  const [guestRole, setGuestRole] = useState("");
  async function handleGuestLogin(role: Role) {
    setGuestRole(role);
    const credentials = GUEST_CREDENTIALS[role];
    login.setEmail(credentials.email);
    login.setPassword(credentials.password);

    // Pass credentials directly to submit
    await login.submit(credentials.email, credentials.password);
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="body2" color="text.secondary">
        Select a role to login as guest
      </Typography>

      {login.error && (
        <Typography color="error" variant="body2">
          {login.error}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" gap={1.5}>
        <Button
          variant="outlined"
          size="large"
          disabled={login.loading}
          onClick={() => handleGuestLogin("admin")}
        >
          {guestRole === "Admin".toLowerCase() ? "Logging in…" : "Admin"}
        </Button>

        <Button
          variant="outlined"
          size="large"
          disabled={login.loading}
          onClick={() => handleGuestLogin("user")}
        >
          {guestRole === "User".toLowerCase() ? "Logging in…" : "User"}
        </Button>

        <Button
          variant="outlined"
          size="large"
          disabled={login.loading}
          onClick={() => handleGuestLogin("manager")}
        >
          {guestRole === "Manager".toLowerCase() ? "Logging in…" : "Manager"}
        </Button>

        <Button
          variant="outlined"
          size="large"
          disabled={login.loading}
          onClick={() => handleGuestLogin("resolver")}
        >
          {guestRole === "Resolver".toLowerCase() ? "Logging in…" : "Resolver"}
        </Button>
      </Box>
    </Box>
  );
}
