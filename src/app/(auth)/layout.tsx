'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      sx={{
        // Fallback gradient background
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        
        // Background image from Unsplash
        backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        // Dark overlay for better readability
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        },
      }}
    >
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  );
}
