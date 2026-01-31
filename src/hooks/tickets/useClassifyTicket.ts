import { useState } from "react";
import { updateTicketClassification } from "@/lib/api/api.tickets";

export function useClassifyTicket(ticketId: string, onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    console.log("useClassifyTicket: open called");
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setLoading(false);
  };

  const updateType = async (type: string) => {
    try {
      setLoading(true);
      await updateTicketClassification(ticketId, type, undefined);
      onSuccess();
      close();
    } catch (err) {
      console.error("Failed to update ticket type:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (priority: string) => {
    try {
      setLoading(true);
      await updateTicketClassification(ticketId, undefined, priority);
      onSuccess();
      close();
    } catch (err) {
      console.error("Failed to update ticket priority:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    loading,
    open,
    close,
    updateType,
    updatePriority,
  };
}
