import { assignTicket } from "@/lib/api/api.tickets";
import { getAllResolvers } from "@/lib/api/api.users";
import { IUser } from "@/lib/types";
import { useEffect, useState } from "react";

export function useAssignResolver(ticketId: string, refresh: () => void) {
  const [open, setOpen] = useState(false);
  const [resolvers, setResolvers] = useState<IUser[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getAllResolvers().then(setResolvers);
    }
  }, [open]);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelected("");
  }

  async function handleAssign() {
    if (!selected) return;

    setLoading(true);
    await assignTicket(ticketId, selected);
    setLoading(false);
    handleClose();
    refresh();
  }

  return {
    open: handleOpen,

    dialogProps: {
      open,
      resolvers,
      selectedResolver: selected,
      loading,
      onSelect: setSelected,
      onClose: handleClose,
      onAssign: handleAssign,
    },
  };
}
