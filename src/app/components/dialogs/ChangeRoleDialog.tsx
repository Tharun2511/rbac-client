"use client";

import { IRole } from "@/lib/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  loading: boolean;
  currentRole: string;
  onSelectRole: (v: IRole) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ChangeRoleDialog({
  open,
  loading,
  currentRole,
  onSelectRole,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change User Role</DialogTitle>

      <DialogContent>
        <Typography variant="body2" mb={2}>
          Current role: <strong>{currentRole}</strong>
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            fullWidth
            label="Select new role"
            defaultValue={currentRole}
            onChange={(e) => onSelectRole(e.target.value as IRole)}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="RESOLVER">Resolver</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {loading ? "Updating…" : "Update Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
