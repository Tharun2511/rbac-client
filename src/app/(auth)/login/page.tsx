"use client";
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import LoginCard from "@/app/components/auth/LoginCard";
import LoginForm from "@/app/components/auth/LoginForm";
import GuestLoginOptions from "@/app/components/auth/GuestLoginOptions";

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <LoginCard>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="login tabs"
        >
          <Tab label="Sign In" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Guest Login" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0">
        {tabValue === 0 && <LoginForm />}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1">
        {tabValue === 1 && <GuestLoginOptions />}
      </Box>
    </LoginCard>
  );
}
