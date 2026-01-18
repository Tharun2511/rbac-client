'use client';

import { Box, Typography } from '@mui/material';

const EmptyState = ({ message }: { message: string }) => {
  return (
    <Box textAlign="center" py={4}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export default EmptyState
