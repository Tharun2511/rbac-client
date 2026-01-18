'use client';

import { Chip } from '@mui/material';

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'> = {
  OPEN: 'warning',
  ASSIGNED: 'primary',
  RESOLVED_BY_RESOLVER: 'info',
  VERIFIED_BY_USER: 'success',
  CLOSED: 'default',
};

const StatusChip = ({ status }: { status: string }) => {
  return (
    <Chip
      label={status.replaceAll('_', ' ')}
      color={statusColors[status] || 'default'}
      size="small"
    />
  );
}

export default StatusChip

