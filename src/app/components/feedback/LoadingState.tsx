'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <Box textAlign="center" py={4}>
      <CircularProgress />
      <Typography mt={2} color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default LoadingState
