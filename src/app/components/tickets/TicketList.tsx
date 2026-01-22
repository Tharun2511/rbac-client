'use client';

import TicketItem from './TicketItem';
import { Box } from '@mui/material';
import LoadingState from '../feedback/LoadingState';
import EmptyState from '../feedback/EmptyState';
import ErrorState from '../feedback/ErrorState';
import { ITicket } from '@/lib/types';

interface Props {
  tickets: ITicket[];
  loading: boolean;
  error?: string;
  onItemClick?: (id: string) => void;
}

export default function TicketList({
  tickets,
  loading,
  error,
  onItemClick,
}: Props) {
  if (loading) return <LoadingState label="Loading tickets..." />;
  if (error) return <ErrorState message={error} />;
  if (!tickets.length) return <EmptyState message="No tickets found." />;

  return (
    <Box>
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          onClick={
            onItemClick
              ? () => onItemClick(ticket.id)
              : undefined
          }
        />
      ))}
    </Box>
  );
}
