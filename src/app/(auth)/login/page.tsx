"use client";
import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import LoginCard from "@/app/components/auth/LoginCard";
import LoginForm from "@/app/components/auth/LoginForm";
import GuestLoginOptions from "@/app/components/auth/GuestLoginOptions";

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <LoginCard>
      <Box mb={4} textAlign="center">
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          color="text.primary"
        >
          Welcome back
        </Typography>
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
