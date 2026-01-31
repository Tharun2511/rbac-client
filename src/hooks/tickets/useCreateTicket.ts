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

    // Default priority "LOW" is now handled by backend or implied until manager sets it
    // But api still expects it? Let's check api.tickets.ts.
    // If api expects it, we can pass "LOW" as a default constant here,
    // or update the API to make it optional.
    // Given the requirement "Initally... type of ticket only", maybe we pass "LOW" as hidden default
    // or pass nothing if backend handles it.
    // Let's pass "LOW" for now to satisfy the API signature I changed earlier,
    // OR revert API signature.
    // I will pass "LOW" here invisibly to satisfy the API.
    await createTicket(title, description, "LOW");

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
