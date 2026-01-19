"use client";

import { Paper, Typography, Box } from "@mui/material";

interface Props {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: Props) {
  return (
    <Paper elevation={1}>
      <Box p={2}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
