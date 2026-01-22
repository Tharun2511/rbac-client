'use client';
import PageHeader from '@/app/components/layout/PageHeader';
import TicketList from '@/app/components/tickets/TicketList';
import { useManagerTickets } from '@/hooks/tickets/useUserTickets';
import { useRouter } from 'next/navigation';

export default function ManagerTicketsPage() {
  const router = useRouter();
  const { tickets, loading } = useManagerTickets();

  return (
    <>
      <PageHeader title="All Tickets" />

      <TicketList
        tickets={tickets}
        loading={loading}
        onItemClick={(id) => router.push(`/tickets/${id}`)}
      />
    </>
  );
}
