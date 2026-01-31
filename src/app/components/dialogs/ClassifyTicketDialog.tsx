"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ClassifyTicketDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (type: string, priority: string) => void;
  loading?: boolean;
  currentType?: string;
  currentPriority?: string;
}

export default function ClassifyTicketDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  currentType = "GENERAL",
  currentPriority = "LOW",
}: ClassifyTicketDialogProps) {
  const [type, setType] = useState(currentType);
  const [priority, setPriority] = useState(currentPriority);

  const handleSubmit = () => {
    onConfirm(type, priority);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2, // Rounder corners
          p: 1, // Inner padding
        },
      }}
    >
      <DialogTitle color="primary.main">Classify Ticket</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please categorize this ticket and assign a priority level before
          assigning it to a resolver.
        </Typography>

        <TextField
          select
          label="Ticket Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="BUG">Bug</MenuItem>
          <MenuItem value="FEATURE">Feature</MenuItem>
          <MenuItem value="SUPPORT">Support</MenuItem>
          <MenuItem value="GENERAL">General</MenuItem>
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: 2, color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 2 }}
          autoFocus
        >
          {loading ? "Saving..." : "Save Classification"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
