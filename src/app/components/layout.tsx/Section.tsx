'use client';

import { Box, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  padding?: number;
}

const Section = ({ children, padding = 2 }: Props) => {
  return (
    <Paper elevation={1} sx={{ borderRadius: 1 }}>
      <Box p={padding}>{children}</Box>
    </Paper>
  );
}

export default Section
