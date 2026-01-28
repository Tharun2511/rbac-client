"use client";

import { Box, Typography, Stack, Container } from "@mui/material";
import { ReactNode } from "react";
import { CheckCircle } from "@mui/icons-material";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box minHeight="100vh" display="flex" bgcolor="#FFFFFF">
      {/* Left Side - Hero Section */}
      <Box
        flex={1}
        position="relative"
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        p={8}
        sx={{
          background: "linear-gradient(135deg, #0747A6 0%, #0052CC 100%)",
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* Abstract shapes or patterns could go here */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          width="50%"
          height="50%"
          bgcolor="rgba(255, 255, 255, 0.05)"
          borderRadius="50%"
          sx={{ filter: "blur(100px)" }}
        />

        <Box position="relative" zIndex={2}>
          <Typography variant="h2" fontWeight={700} mb={3} color="inherit">
            Streamline your Internal Workflows
          </Typography>
          <Typography
            variant="h5"
            fontWeight={400}
            color="inherit"
            sx={{ opacity: 0.9, mb: 6, lineHeight: 1.5 }}
          >
            Manage users, resolve tickets, and track progress all in one secure
            platform.
          </Typography>

          <Stack spacing={3}>
            {[
              "Role-Based Access Control",
              "Ticket Tracking",
              "Secure Infrastructure",
              "Premium Experience",
            ].map((feature, index) => (
              <Box key={index} display="flex" alignItems="center" gap={2}>
                <CheckCircle sx={{ color: "#36B37E" }} />
                <Typography variant="h6" fontWeight={500} color="inherit">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        flex={{ xs: 1, md: "0 0 600px" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={{ xs: 3, md: 6, lg: 12 }}
        bgcolor="background.default"
      >
        <Container maxWidth="xs">{children}</Container>
      </Box>
    </Box>
  );
}
