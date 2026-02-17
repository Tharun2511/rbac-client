"use client";

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

interface RoleOption {
  id: string;
  name: string;
  scope: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  currentRole: string;
  roles: RoleOption[];
  onSelectRole: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ChangeRoleDialog({
  open,
  loading,
  currentRole,
  roles,
  onSelectRole,
  onClose,
  onSubmit,
}: Props) {
  const formatRoleName = (name: string) =>
    name
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change User Role</DialogTitle>

      <DialogContent>
        <Typography variant="body2" mb={2}>
          Current role: <strong>{formatRoleName(currentRole)}</strong>
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            fullWidth
            label="Select new role"
            defaultValue={currentRole}
            onChange={(e) => onSelectRole(e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {formatRoleName(role.name)}
              </MenuItem>
            ))}
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
