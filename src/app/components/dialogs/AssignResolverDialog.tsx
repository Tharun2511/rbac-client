"use client";

import { IUser } from "@/lib/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  resolvers: IUser[];
  selectedResolver: string;
  loading: boolean;
  onSelect: (v: string) => void;
  onClose: () => void;
  onAssign: () => void;
}

export default function AssignResolverDialog({
  open,
  resolvers,
  selectedResolver,
  loading,
  onSelect,
  onClose,
  onAssign,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: "none",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle color="text.primary">Assign Resolver</DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <TextField
            select
            fullWidth
            label="Select Resolver"
            value={selectedResolver}
            onChange={(e) => onSelect(e.target.value)}
          >
            {resolvers.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onAssign}
          disabled={loading || !selectedResolver}
          sx={{ borderRadius: 2 }}
        >
          {loading ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
