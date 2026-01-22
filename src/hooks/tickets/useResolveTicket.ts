import { resolveTicket } from "@/lib/api/api.tickets";
import { useState } from "react";

export function useResolveTicket(ticketId: string, refresh: () => void) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    setLoading(true);
    await resolveTicket(ticketId);
    setLoading(false);
    handleClose();
    refresh();
  }

  return {
    open: handleOpen,

    dialogProps: {
      open,
      loading,
      title: "Mark Ticket as Resolved",
      description:
        "This will mark the ticket as resolved. The user will now verify the resolution.",
      confirmLabel: "Resolve Ticket",
      onCancel: handleClose,
      onConfirm: handleSubmit,
    },
  };
}
