"use client";
import { useState } from "react";
import { Box, Tabs, Tab, Typography, Stack } from "@mui/material";
import LoginCard from "@/app/components/auth/LoginCard";
import SentinelLogo from "@/app/components/branding/SentinelLogo";
import LoginForm from "@/app/components/auth/LoginForm";
import GuestLoginOptions from "@/app/components/auth/GuestLoginOptions";

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <LoginCard>
      <Box
        mb={5}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Stack mb={2} direction="row" spacing={1} alignItems="center">
          <SentinelLogo size={48} />
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #60A5FA 30%, #3B82F6 90%)"
                  : "linear-gradient(45deg, #2563EB 30%, #1D4ED8 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Sentinel
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          Please enter your details to sign in
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="login tabs"
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Guest Access" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Standard Login" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0">
        {tabValue === 0 && <GuestLoginOptions />}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1">
        {tabValue === 1 && <LoginForm />}
      </Box>
    </LoginCard>
  );
}
