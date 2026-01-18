"use client";

import { Box, Typography } from "@mui/material";

const ErrorState = ({ message }: { message: string }) => {
  return (
    <Box textAlign="center" py={4}>
      <Typography color="error">{message}</Typography>
    </Box>
  );
};

export default ErrorState;
