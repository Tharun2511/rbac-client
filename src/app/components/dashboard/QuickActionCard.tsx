"use client";

import { Paper, Typography, Box, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

interface Props {
  title: string;
  description: string;
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  onClick,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#F4F5F7"
              : "rgba(255, 255, 255, 0.05)",
          borderColor: "primary.main",
          transform: "translateX(4px)",
        },
      }}
      onClick={onClick}
    >
      <Box p={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
              {description}
            </Typography>
          </Box>
          <ArrowForward color="primary" sx={{ opacity: 0.7 }} />
        </Stack>
      </Box>
    </Paper>
  );
}
