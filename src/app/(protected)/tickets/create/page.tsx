"use client";

import { Paper } from "@mui/material";
import { useCreateTicket } from "@/hooks/tickets/useCreateTicket";
import { useRouter } from "next/navigation";
import TicketCreateForm from "@/app/components/forms/TicketCreateForm";
import PageHeader from "@/app/components/layout/PageHeader";

export default function CreateTicketPage() {
  const router = useRouter();

  const { title, description, loading, setTitle, setDescription, submit } =
    useCreateTicket(() => router.push("/tickets"));

  return (
    <>
      <PageHeader title="Create Ticket" />

      <Paper elevation={1} sx={{ p: 3 }}>
        <TicketCreateForm
          title={title}
          description={description}
          loading={loading}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={submit}
        />
      </Paper>
    </>
  );
}
