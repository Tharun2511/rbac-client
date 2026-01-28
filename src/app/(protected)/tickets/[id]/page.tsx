"use client";

import { useParams } from "next/navigation";
import { Grid } from "@mui/material";

import { useTicketDetails } from "@/hooks/tickets/useTicketDetails";
import { useResolveTicket } from "@/hooks/tickets/useResolveTicket";
import { useVerifyTicket } from "@/hooks/tickets/useVerifyTicket";
import { useCloseTicket } from "@/hooks/tickets/useCloseTicket";
import { useAssignResolver } from "@/hooks/tickets/useAssignResolver";
import useUserDetails from "@/hooks/useUserDetails";

import LoadingState from "@/app/components/feedback/LoadingState";
import TicketInfoCard from "@/app/components/tickets/TicketInfoCard";
import TicketSidebar from "@/app/components/tickets/TicketSidebar";
import TicketActions from "@/app/components/tickets/TicketActions";
import AssignResolverDialog from "@/app/components/dialogs/AssignResolverDialog";
import ConfirmDialog from "@/app/components/dialogs/ConfirmDialog";
import PageHeader from "@/app/components/layout/PageHeader";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const user = useUserDetails();
  const { ticket, loading, refresh } = useTicketDetails(id as string);

  // Hooks for workflow actions
  const assign = useAssignResolver(id as string, refresh);
  const resolve = useResolveTicket(id as string, refresh);
  const verify = useVerifyTicket(id as string, refresh);
  const close = useCloseTicket(id as string, refresh);

  if (loading || !ticket) return <LoadingState label="Loading ticket..." />;

  return (
    <>
      <PageHeader title="Ticket Details" />
      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TicketInfoCard ticket={ticket} />
        </Grid>

        {/* Sidebar Area */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TicketSidebar
            ticket={ticket}
            actions={
              <TicketActions
                ticket={ticket}
                role={user?.role || ""}
                onAssign={assign.open}
                onResolve={resolve.open}
                onVerify={verify.open}
                onClose={close.open}
              />
            }
          />
        </Grid>
      </Grid>

      {/* Dialogs */}
      <AssignResolverDialog {...assign.dialogProps} />
      <ConfirmDialog {...resolve.dialogProps} />
      <ConfirmDialog {...verify.dialogProps} />
      <ConfirmDialog {...close.dialogProps} />
    </>
  );
}
