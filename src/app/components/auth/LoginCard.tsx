'use client';

import { Paper, Box } from '@mui/material';
import { ReactNode } from 'react';

export default function LoginCard({ children }: { children: ReactNode }) {
  return (
    <Paper elevation={3} sx={{ width: 380 }}>
      <Box p={4}>{children}</Box>
    </Paper>
  );
}
