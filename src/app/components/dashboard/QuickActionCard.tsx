'use client';

import { Paper, Typography, Box } from '@mui/material';

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
      elevation={1}
      sx={{
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
      onClick={onClick}
    >
      <Box p={2}>
        <Typography fontWeight={600}>{title}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}
