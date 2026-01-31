"use client";

import { Paper, Typography, Box } from "@mui/material";

interface Props {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderLeft: "4px solid #0052CC", // Accent color
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0px 4px 8px rgba(9, 30, 66, 0.15)"
              : "0px 4px 8px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Box p={3}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          textTransform="uppercase"
          letterSpacing={0.5}
          mb={1}
        >
          {label}
        </Typography>

        <Typography variant="h3" fontWeight={700} color="text.primary">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
