import { verifyTicket } from "@/lib/api/api.tickets";
import { useState } from "react";

export function useVerifyTicket(ticketId: string, refresh: () => void) {
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
    await verifyTicket(ticketId);
    setLoading(false);
    handleClose();
    refresh();
  }

  return {
    open: handleOpen,

    dialogProps: {
      open,
      loading,
      title: "Verify Resolution",
      description: "You are confirming that the resolver fixed the issue.",
      confirmLabel: "Verify",
      onCancel: handleClose,
      onConfirm: handleSubmit,
    },
  };
}
