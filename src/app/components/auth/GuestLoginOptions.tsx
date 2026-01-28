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
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Select a role to quickly explore the platform as a guest.
      </Typography>

      {login.error && (
        <Typography color="error" variant="body2" textAlign="center">
          {login.error}
        </Typography>
      )}

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        {(["admin", "user", "manager", "resolver"] as const).map((role) => (
          <Button
            key={role}
            variant={guestRole === role ? "contained" : "outlined"}
            size="large"
            disabled={login.loading}
            onClick={() => handleGuestLogin(role)}
            sx={{
              borderRadius: 2,
              textTransform: "capitalize",
              height: 48,
              borderColor: "#DFE1E6",
              color:
                guestRole === role ? "primary.contrastText" : "text.primary",
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor:
                  guestRole === role ? "primary.dark" : "action.hover",
              },
            }}
          >
            {guestRole === role ? "Logging in..." : role}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
