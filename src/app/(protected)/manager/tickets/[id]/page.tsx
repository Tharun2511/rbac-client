"use client";

import { useParams } from "next/navigation";
import { useTicketDetails } from "@/hooks/tickets/useTicketDetails";
import { useAssignResolver } from "@/hooks/tickets/useAssignResolver";
import { useCloseTicket } from "@/hooks/tickets/useCloseTicket";
import LoadingState from "@/app/components/feedback/LoadingState";
import TicketDetailsHeader from "@/app/components/tickets/TicketDetailsHeader";
import TicketInfoCard from "@/app/components/tickets/TicketInfoCard";
import TicketActions from "@/app/components/tickets/TicketActions";
import ConfirmDialog from "@/app/components/dialogs/ConfirmDialog";
import AssignResolverDialog from "@/app/components/dialogs/AssignResolverDialog";
import { useClassifyTicket } from "@/hooks/tickets/useClassifyTicket";
import useUserDetails from "@/hooks/useUserDetails";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { ticket, loading, refresh } = useTicketDetails(id as string);
  const user = useUserDetails();

  // Hook Instances (Manage Workflow)
  const assign = useAssignResolver(id as string, refresh);
  const close = useCloseTicket(id as string, refresh);
  const classify = useClassifyTicket(id as string, refresh);

  if (loading || !ticket) {
    return <LoadingState label="Loading ticket..." />;
  }

  // Classification handlers
  const handleUpdateType = (newType: string) => {
    classify.updateType(newType);
  };

  const handleUpdatePriority = (newPriority: string) => {
    classify.updatePriority(newPriority);
  };

  return (
    <>
      {/* Header: title, status, metadata */}
      <TicketDetailsHeader ticket={ticket} />

      {/* Description */}
      <TicketInfoCard ticket={ticket} />

      {/* Workflow Actions */}
      <TicketActions
        ticket={ticket}
        role={user?.role || ""}
        onAssign={assign.open}
        onUpdateType={handleUpdateType}
        onUpdatePriority={handleUpdatePriority}
        onClose={close.open}
        loading={classify.loading}
      />

      {/* Dialogs */}
      <AssignResolverDialog {...assign.dialogProps} />
      <ConfirmDialog {...close.dialogProps} />
    </>
  );
}
