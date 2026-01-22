import { createTicket } from "@/lib/api/api.tickets";
import { useState } from "react";

export function useCreateTicket(onSuccess: () => void) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    if (!description.trim()) return;

    setLoading(true);

    await createTicket(title, description);

    setLoading(false);
    onSuccess();
  }

  return {
    title,
    description,
    loading,
    setTitle,
    setDescription,
    submit,
  };
}
