import { closeTicket } from "@/lib/api/api.tickets";
import { useState } from "react";

export function useCloseTicket(ticketId: string, refresh: () => void) {
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
    await closeTicket(ticketId);
    setLoading(false);
    handleClose();
    refresh();
  }

  return {
    open: handleOpen,

    dialogProps: {
      open,
      loading,
      title: "Close Ticket",
      description: "Closing a ticket means the workflow is complete.",
      confirmLabel: "Close Ticket",
      onCancel: handleClose,
      onConfirm: handleSubmit,
    },
  };
}
