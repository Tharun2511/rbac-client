"use client";

import { Box, Button, TextField } from "@mui/material";

interface Props {
  title: string;
  description: string;
  priority: string;
  loading: boolean;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onSubmit: () => void;
}

export default function TicketCreateForm({
  title,
  description,
  priority,
  loading,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onSubmit,
}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        multiline
        rows={4}
        fullWidth
        required
      />

      <Button
        variant="contained"
        size="large"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Creating…" : "Create Ticket"}
      </Button>
    </Box>
  );
}
