"use client";

import { useCreateTicket } from "@/hooks/tickets/useCreateTicket";
import { useRouter } from "next/navigation";
import { Paper } from "@mui/material";
import PageHeader from "@/app/components/layout/PageHeader";
import TicketCreateForm from "@/app/components/forms/TicketCreateForm";

export default function CreateTicketPage() {
  const router = useRouter();

  const { title, description, loading, setTitle, setDescription, submit } =
    useCreateTicket(() => router.push("/tickets"));

  return (
    <>
      <PageHeader title="Create Ticket" />

      <Paper elevation={1} style={{ padding: 24 }}>
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
